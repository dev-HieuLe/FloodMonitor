// utils/corridor.util.js
export function buildCorridorBBox(
  startLat,
  startLon,
  endLat,
  endLon,
  padding = 0.03
) {
  return {
    minLat: Math.min(startLat, endLat) - padding,
    maxLat: Math.max(startLat, endLat) + padding,
    minLon: Math.min(startLon, endLon) - padding,
    maxLon: Math.max(startLon, endLon) + padding,
  };
}
