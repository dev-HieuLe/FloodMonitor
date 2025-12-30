// services/graph.service.js
import db from "../db.js";
import { nodeKey } from "../utils/node.utils.js";

/**
 * Haversine distance
 */
function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Build routing graph
 * 🚫 HARD BLOCK only truly flooded (RED) edges
 */
export async function buildGraph(blockedEdges, bbox) {
  const [segments] = await db.query(
    `
    SELECT
      start_lat,
      start_lon,
      end_lat,
      end_lon
    FROM road_segments
    WHERE mid_lat BETWEEN ? AND ?
      AND mid_lon BETWEEN ? AND ?
    `,
    [bbox.minLat, bbox.maxLat, bbox.minLon, bbox.maxLon]
  );

  const graph = new Map();

  function addEdge(from, to, weight) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push({ to, weight });
  }

  let blockedCount = 0;

  for (const s of segments) {
    // 🔑 MUST MATCH flood.service.js
    const from = nodeKey(s.start_lat, s.start_lon, 5);
    const to = nodeKey(s.end_lat, s.end_lon, 5);
    const edgeKey = `${from}|${to}`;

    // 🚫 RED flood only
    if (blockedEdges.has(edgeKey)) {
      blockedCount++;
      continue;
    }

    const dist = distanceMeters(s.start_lat, s.start_lon, s.end_lat, s.end_lon);

    addEdge(from, to, dist);
    addEdge(to, from, dist);
  }

  console.log(`[GRAPH] nodes=${graph.size} blockedEdgesUsed=${blockedCount}`);

  return graph;
}
