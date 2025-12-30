import db from "../../db.js";
import { getRainAtPoint } from "../../services/rain.service.js";
import { computeFloodScore } from "../../services/flood.service.js";

export const getFloodedRoadSegments = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }

    const rain = await getRainAtPoint(lat, lon);
    let effectiveRain = rain.effectiveRain;

    // drying guard (important for HCM)
    if (rain.rain1h === 0 && rain.rain3h === 0 && rain.rain6h === 0) {
      effectiveRain *= 0.3;
    }

    const RADIUS = 0.05;

    const [segments] = await db.query(
      `
      SELECT
        road_id,
        segment_index,
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
      [lat - RADIUS, lat + RADIUS, lon - RADIUS, lon + RADIUS]
    );

    const result = segments.map((seg) => {
      const floodScore = computeFloodScore(
        effectiveRain,
        seg.elevation,
        seg.slope
      );

      let floodLevel = "none";
      if (floodScore >= 40) floodLevel = "high"; // 🔴 rare
      else if (floodScore >= 26) floodLevel = "medium"; // 🟠
      else if (floodScore >= 18) floodLevel = "low"; // 🟡

      return {
        roadId: seg.road_id,
        segmentIndex: seg.segment_index,
        coords: [
          [seg.start_lat, seg.start_lon],
          [seg.end_lat, seg.end_lon],
        ],
        elevation: seg.elevation,
        slope: seg.slope,
        floodLevel,
        floodScore: Number(floodScore.toFixed(1)),
      };
    });

    res.json({
      rain,
      count: result.length,
      segments: result,
    });
  } catch (err) {
    console.error("Flood controller error:", err);
    res.status(500).json({ error: "Flood calculation failed" });
  }
};
