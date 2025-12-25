import FastPriorityQueue from "fastpriorityqueue";

/**
 * Haversine distance in meters
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export function astar(graph, start, end, bbox) {
  const open = new FastPriorityQueue((a, b) => a.f < b.f);

  const gScore = new Map();
  const cameFrom = new Map();
  const closed = new Set();

  gScore.set(start, 0);

  const [endLat, endLon] = end.split(",").map(Number);

  open.add({ node: start, f: 0 });

  while (!open.isEmpty()) {
    const { node } = open.poll();

    if (closed.has(node)) continue;
    closed.add(node);

    // ✅ SUCCESS CONDITION (EARLY EXIT)
    if (node === end) break;

    const [lat, lon] = node.split(",").map(Number);

    // 🚫 Bounding box prune
    if (
      lat < bbox.minLat ||
      lat > bbox.maxLat ||
      lon < bbox.minLon ||
      lon > bbox.maxLon
    ) {
      continue;
    }

    for (const { to, weight } of graph.get(node) || []) {
      const tentativeG = gScore.get(node) + weight;

      if (tentativeG < (gScore.get(to) ?? Infinity)) {
        cameFrom.set(to, node);
        gScore.set(to, tentativeG);

        const [tLat, tLon] = to.split(",").map(Number);
        const h = haversine(tLat, tLon, endLat, endLon);

        open.add({
          node: to,
          f: tentativeG + h,
        });
      }
    }
  }

  // ✅ CORRECT FINAL CHECK
  if (!gScore.has(end)) return null;

  // 🧵 Reconstruct path
  const nodes = [];
  let cur = end;

  while (cur) {
    nodes.unshift(cur);
    cur = cameFrom.get(cur);
  }

  const coords = nodes.map((n) => {
    const [lat, lon] = n.split(",").map(Number);
    return [lat, lon];
  });

  return {
    nodes,
    coords,
    distance: gScore.get(end),
  };
}
