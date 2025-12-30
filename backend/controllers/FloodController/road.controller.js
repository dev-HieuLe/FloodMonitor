import axios from "axios";
export const getRoadsAroundCity = async () => {
  const query = `
    [out:json][timeout:180];
    (
      way["highway"~"^(primary|secondary|tertiary|residential|unclassified)$"]
      (10.45,106.40,11.05,107.00);
    );
    out geom;
  `;

  const response = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" }, timeout: 180000 }
  );

  return response.data.elements;
};
