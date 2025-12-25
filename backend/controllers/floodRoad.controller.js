import { getRainAtPoint } from "../services/rain.service.js";
import db from "../db.js";

export const getFloodedRoadSegments = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }

    // 1️⃣ Get structured rain data
    const rain = await getRainAtPoint(lat, lon);
    const effectiveRain = rain.effectiveRain;

    // 🧠 HARD DRY GUARD (very important for HCM)
    if (rain.rain1h === 0 && rain.rain3h === 0 && rain.rain6h === 0) {
      // city is drying → reduce impact
      rain.effectiveRain *= 0.3;
    }

    // 2️⃣ Get road segments around point
    const RADIUS = 0.05; // ~5km

    const [segments] = await db.query(
      `
      SELECT
        rs.road_id,
        rs.segment_index,
        rs.start_lat,
        rs.start_lon,
        rs.end_lat,
        rs.end_lon,
        rs.elevation,
        rs.slope
      FROM road_segments rs
      WHERE rs.mid_lat BETWEEN ? AND ?
        AND rs.mid_lon BETWEEN ? AND ?
      `,
      [lat - RADIUS, lat + RADIUS, lon - RADIUS, lon + RADIUS]
    );

    const result = segments.map((seg) => {
      let floodLevel = "none";

      // 🧠 Flood score model
      let floodScore = effectiveRain;

      // elevation effect (low = worse)
      if (seg.elevation <= 2) floodScore *= 1.8;
      else if (seg.elevation <= 5) floodScore *= 1.3;
      else if (seg.elevation <= 10) floodScore *= 1.1;
      else floodScore *= 0.6;

      // slope effect (flat = worse)
      if (seg.slope !== null) {
        if (seg.slope < 0.5) floodScore *= 1.6;
        else if (seg.slope < 1) floodScore *= 1.2;
        else floodScore *= 0.7;
      }

      // 🌊 Final classification
      if (floodScore >= 25) floodLevel = "high";
      else if (floodScore >= 15) floodLevel = "medium";
      else if (floodScore >= 8) floodLevel = "low";

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
        floodScore: Number(floodScore.toFixed(2)),
      };
    });

    res.json({
      rain,
      count: result.length,
      segments: result,
    });
  } catch (err) {
    console.error("Flood road error:", err);
    res.status(500).json({ error: "Flood calculation failed" });
  }
};
