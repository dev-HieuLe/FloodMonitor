export function dijkstra(graph, start, end) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  for (const node of graph.keys()) {
    dist.set(node, Infinity);
  }
  dist.set(start, 0);

  while (true) {
    let u = null;
    let min = Infinity;

    for (const [node, d] of dist) {
      if (!visited.has(node) && d < min) {
        min = d;
        u = node;
      }
    }

    if (!u || u === end) break;

    visited.add(u);

    for (const { to, weight } of graph.get(u) || []) {
      const alt = dist.get(u) + weight;
      if (alt < dist.get(to)) {
        dist.set(to, alt);
        prev.set(to, u);
      }
    }
  }

  if (!prev.has(end)) return null;

  const nodes = [];
  let cur = end;
  while (cur) {
    nodes.unshift(cur);
    cur = prev.get(cur);
  }

  const coords = nodes.map((n) => {
    const [lat, lon] = n.split(",").map(Number);
    return { lat, lng: lon };
  });

  return {
    nodes,
    coords,
    distance: dist.get(end),
  };
}
