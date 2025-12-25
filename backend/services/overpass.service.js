import axios from "axios";

export async function getRoadsInHCM() {
  const query = `
  [out:json];
  area["name"="Ho Chi Minh City"]->.a;
  (
    way["highway"](area.a);
  );
  out geom;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { timeout: 60000 }
  );

  return res.data.elements.filter((e) => e.type === "way");
}
