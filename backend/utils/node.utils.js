export function nodeKey(lat, lon, precision = 5) {
  return lat.toFixed(precision) + "," + lon.toFixed(precision);
}
