import { getFloodBlockedEdges } from "./flood.service.js";
import { buildGraph } from "./graph.service.js";
import { buildCorridorBBox } from "../utils/corridor.util.js";
import { snapToGraph } from "../utils/snap.util.js";
import { astar } from "./astar.service.js";
import { evaluateTraffic } from "./traffic.service.js";

export async function getBestFloodSafeRoutes(
  startLat,
  startLon,
  endLat,
  endLon
) {
  console.log("=== ROUTE PIPELINE START ===");

  console.time("FLOOD");
  const blockedEdges = await getFloodBlockedEdges(
    startLat,
    startLon,
    endLat,
    endLon
  );
  console.timeEnd("FLOOD");
  console.log("Blocked edges:", blockedEdges.size);

  const bbox = buildCorridorBBox(startLat, startLon, endLat, endLon, 0.05);
  console.log("BBox:", bbox);

  console.time("GRAPH");
  const graph = await buildGraph(blockedEdges, bbox);
  console.timeEnd("GRAPH");
  console.log("Graph nodes:", graph.size);

  console.time("SNAP");
  const start = snapToGraph(graph, startLat, startLon);
  const end = snapToGraph(graph, endLat, endLon);
  console.timeEnd("SNAP");

  console.log("START:", start, "neighbors:", graph.get(start)?.length);
  console.log("END:", end, "neighbors:", graph.get(end)?.length);

  if (!start || !end) return null;

  console.time("PATH");
  const path = astar(graph, start, end, bbox);
  console.timeEnd("PATH");

  if (!path) {
    console.error("❌ NO PATH FOUND");
    return null;
  }

  console.time("TRAFFIC");
  const traffic = await evaluateTraffic(path.coords);
  console.timeEnd("TRAFFIC");

  console.log("=== ROUTE PIPELINE END ===");

  return {
    best: {
      geometry: path.coords, // [[lat, lng], ...]
      distance: path.distance,
      duration: traffic.duration,
      trafficDelay: traffic.trafficDelay,
    },
    alternatives: [],
  };
}
