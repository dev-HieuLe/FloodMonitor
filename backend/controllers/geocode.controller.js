export const geocodeLocation = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Missing query" });
    }

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(q + ", Vietnam")}` +
      `&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "flood-map-app",
      },
    });

    const data = await response.json();

    if (!data.length) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json({
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      name: data[0].display_name,
    });
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
};
