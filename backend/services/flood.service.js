import db from "../db.js";
import { getRainAtPoint } from "./rain.service.js";

export async function getFloodBlockedEdges(startLat, startLon, endLat, endLon) {
  const rain = await getRainAtPoint(startLat, startLon);
  let effectiveRain = rain.effectiveRain;

  console.log("[FLOOD] rain =", rain);

  // 🧠 Drying guard
  if (rain.rain1h === 0 && rain.rain3h === 0 && rain.rain6h === 0) {
    effectiveRain *= 0.3;
  }

  const padding = 0.05;

  const minLat = Math.min(startLat, endLat) - padding;
  const maxLat = Math.max(startLat, endLat) + padding;
  const minLon = Math.min(startLon, endLon) - padding;
  const maxLon = Math.max(startLon, endLon) + padding;

  const [segments] = await db.query(
    `
    SELECT start_lat, start_lon, end_lat, end_lon, elevation, slope
    FROM road_segments
    WHERE mid_lat BETWEEN ? AND ?
      AND mid_lon BETWEEN ? AND ?
    `,
    [minLat, maxLat, minLon, maxLon]
  );

  const blocked = new Set();

  for (const s of segments) {
    let floodScore = effectiveRain;

    if (s.elevation <= 2) floodScore *= 1.8;
    else if (s.elevation <= 5) floodScore *= 1.3;
    else if (s.elevation <= 10) floodScore *= 1.1;
    else floodScore *= 0.6;

    if (s.slope != null) {
      if (s.slope < 0.5) floodScore *= 1.6;
      else if (s.slope < 1) floodScore *= 1.2;
      else floodScore *= 0.7;
    }

    if (floodScore >= 14) {
      blocked.add(`${s.start_lat},${s.start_lon}|${s.end_lat},${s.end_lon}`);
      blocked.add(`${s.end_lat},${s.end_lon}|${s.start_lat},${s.start_lon}`);
    }
  }

  console.log("[FLOOD] blocked edges =", blocked.size);

  return blocked;
}
