export const splitRoadIntoSegments = (road) => {
  const segments = [];

  if (!road.geometry || road.geometry.length < 2) {
    return segments;
  }

  for (let i = 0; i < road.geometry.length - 1; i++) {
    const a = road.geometry[i];
    const b = road.geometry[i + 1];

    // Supports both {lat, lon} and [lon, lat]
    const startLat = a.lat ?? a[1];
    const startLon = a.lon ?? a[0];
    const endLat = b.lat ?? b[1];
    const endLon = b.lon ?? b[0];

    if (
      startLat == null ||
      startLon == null ||
      endLat == null ||
      endLon == null
    ) {
      continue;
    }

    segments.push({
      roadId: road.id,
      segmentIndex: i,
      start: { lat: startLat, lon: startLon },
      end: { lat: endLat, lon: endLon },
      mid: {
        lat: (startLat + endLat) / 2,
        lon: (startLon + endLon) / 2,
      },
    });
  }

  return segments;
};
