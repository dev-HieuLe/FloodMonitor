export function snapToGraph(graph, lat, lon) {
  let best = null;
  let bestDist = Infinity;

  for (const node of graph.keys()) {
    const [nLat, nLon] = node.split(",").map(Number);
    const d = (nLat - lat) ** 2 + (nLon - lon) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = node;
    }
  }

  return best;
}
