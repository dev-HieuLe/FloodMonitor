import { getBestFloodSafeRoutes } from "../services/route.service.js";

export async function getBestFloodSafeRoute(req, res) {
  const { startLat, startLon, endLat, endLon } = req.query;

  const result = await getBestFloodSafeRoutes(
    Number(startLat),
    Number(startLon),
    Number(endLat),
    Number(endLon)
  );

  res.json(result);
}
