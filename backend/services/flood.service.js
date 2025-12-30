// services/flood.service.js
import db from "../db.js";
import { getRainAtPoint } from "./rain.service.js";
import { nodeKey } from "../utils/node.utils.js";

/**
 * Compress rain so monsoon ≠ disaster
 */
function baseRainImpact(effectiveRain) {
  return Math.pow(effectiveRain, 0.85);
}

/**
 * Shared flood math (USED EVERYWHERE)
 */
export function computeFloodScore(effectiveRain, elevation, slope) {
  let score = baseRainImpact(effectiveRain);

  // elevation (major factor)
  if (elevation <= 2) score *= 1.6;
  else if (elevation <= 5) score *= 1.25;
  else if (elevation <= 10) score *= 1.1;
  else score *= 0.35; // high ground almost never floods

  // slope (drainage effect)
  if (slope != null) {
    if (slope < 0.3) score *= 1.3;
    else if (slope < 0.7) score *= 1.15;
    else score *= 0.85;
  }

  return score;
}

/**
 * 🚫 Used by routing
 * Blocks ONLY roads that are physically flooded (🔴)
 */
export async function getFloodBlockedEdges(startLat, startLon, endLat, endLon) {
  // 🌧️ Sample rain at route center (stable + realistic)
  const centerLat = (startLat + endLat) / 2;
  const centerLon = (startLon + endLon) / 2;

  const rain = await getRainAtPoint(centerLat, centerLon);
  let effectiveRain = rain.effectiveRain;

  // 🧠 Drying guard (critical for Vietnam)
  if (rain.rain1h === 0 && rain.rain3h === 0 && rain.rain6h === 0) {
    effectiveRain *= 0.25;
  }

  // 🌧️ Absolute guard: no meaningful rain → no flood
  if (effectiveRain < 3) {
    console.log("[FLOOD] rain too low → no blocks");
    return new Set();
  }

  // 🧭 Corridor-only bbox
  const padding = 0.03;

  const minLat = Math.min(startLat, endLat) - padding;
  const maxLat = Math.max(startLat, endLat) + padding;
  const minLon = Math.min(startLon, endLon) - padding;
  const maxLon = Math.max(startLon, endLon) + padding;

  const [segments] = await db.query(
    `
    SELECT
      start_lat,
      start_lon,
      end_lat,
      end_lon,
      elevation,
      slope
    FROM road_segments
    WHERE mid_lat BETWEEN ? AND ?
      AND mid_lon BETWEEN ? AND ?
    `,
    [minLat, maxLat, minLon, maxLon]
  );

  const blocked = new Set();

  for (const s of segments) {
    const floodScore = computeFloodScore(effectiveRain, s.elevation, s.slope);

    /**
     * 🔴 REAL FLOOD THRESHOLD
     * >= 45 means:
     * - water depth likely > 20–30cm
     * - motorbike impassable
     * - car unsafe
     */
    if (floodScore >= 45) {
      const from = nodeKey(s.start_lat, s.start_lon, 5);
      const to = nodeKey(s.end_lat, s.end_lon, 5);

      blocked.add(`${from}|${to}`);
      blocked.add(`${to}|${from}`);
    }
  }

  console.log(
    `[FLOOD] RED blocked edges=${blocked.size} rain=${effectiveRain.toFixed(2)}`
  );

  return blocked;
}
