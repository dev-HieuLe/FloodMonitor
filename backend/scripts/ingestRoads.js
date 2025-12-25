import db from "../db.js";
import { getRoadsAroundCity } from "../controllers/road.controller.js";

const HCM = { lat: 10.7769, lon: 106.7009 };

async function ingestRoads() {
  console.log("Fetching roads...");
  const roads = await getRoadsAroundCity(HCM.lat, HCM.lon, 30000);

  let count = 0;

  for (const road of roads) {
    await db.query(
      `
      INSERT IGNORE INTO roads (osm_id, name, highway)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE osm_id = osm_id
      `,
      [
        road.id, // OSM WAY ID
        road.tags?.name || null,
        road.tags?.highway || null,
      ]
    );

    count++;
    if (count % 100 === 0) {
      console.log(`Inserted ${count} roads`);
    }
  }

  console.log("DONE ingesting roads");
  process.exit(0);
}

ingestRoads().catch(console.error);
