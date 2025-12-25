import db from "../db.js";
import { getRoadsAroundCity } from "../controllers/road.controller.js";
import { splitRoadIntoSegments } from "../services/road.service.js";
import { getElevationAtPoint } from "../services/localElevation.service.js";

function segmentLengthMeters(start, end) {
  return (
    111320 *
    Math.sqrt(
      Math.pow(end.lat - start.lat, 2) + Math.pow(end.lon - start.lon, 2)
    )
  );
}

async function ingestSegments() {
  console.log("Fetching roads (HCM bounding box)...");
  const roads = await getRoadsAroundCity();

  console.log(`Fetched ${roads.length} roads`);

  let count = 0;

  for (const road of roads) {
    const [[dbRoad]] = await db.query("SELECT id FROM roads WHERE osm_id = ?", [
      road.id,
    ]);

    if (!dbRoad) continue;

    const segments = splitRoadIntoSegments(road);

    for (const seg of segments) {
      const midLat = (seg.start.lat + seg.end.lat) / 2;
      const midLon = (seg.start.lon + seg.end.lon) / 2;

      // 🗻 Elevations
      const startElevation =
        (await getElevationAtPoint(seg.start.lat, seg.start.lon)) ?? null;
      const endElevation =
        (await getElevationAtPoint(seg.end.lat, seg.end.lon)) ?? null;
      const midElevation = (await getElevationAtPoint(midLat, midLon)) ?? null;
      // ⛔ Skip if any elevation missing
      if (
        startElevation === null &&
        endElevation === null &&
        midElevation === null
      )
        continue;

      // 📐 Slope
      const length = segmentLengthMeters(seg.start, seg.end);
      if (length === 0) continue;

      const slope = Math.abs(startElevation - endElevation) / length;

      await db.query(
        `
        INSERT INTO road_segments
        (
          road_id,
          segment_index,
          start_lat,
          start_lon,
          end_lat,
          end_lon,
          mid_lat,
          mid_lon,
          elevation,
          start_elevation,
          end_elevation,
          slope
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          elevation = VALUES(elevation),
          start_elevation = VALUES(start_elevation),
          end_elevation = VALUES(end_elevation),
          slope = VALUES(slope)
        `,
        [
          dbRoad.id,
          seg.segmentIndex,
          seg.start.lat,
          seg.start.lon,
          seg.end.lat,
          seg.end.lon,
          midLat,
          midLon,
          midElevation,
          startElevation,
          endElevation,
          slope,
        ]
      );

      count++;
      if (count % 200 === 0) {
        console.log(`Inserted ${count} segments`);
      }
    }
  }

  console.log("DONE ingesting segments");
  process.exit(0);
}

ingestSegments().catch(console.error);
