import gdal from "gdal-async";
import path from "path";

/**
 * Load DEM datasets once (IMPORTANT for performance)
 */

/**
 * THIS IS USING DEM
 */
const demFiles = ["dem1.tif", "dem2.tif", "dem3.tif"];

const datasets = demFiles.map((file) => {
  const ds = gdal.open(
    path.resolve(
      "/Users/admin/Documents/GitHub/FloodMonitor/backend/Data/",
      file
    )
  );

  return {
    dataset: ds,
    band: ds.bands.get(1),
    geoTransform: ds.geoTransform,
    rasterX: ds.rasterSize.x,
    rasterY: ds.rasterSize.y,
  };
});

/**
 * Convert lat/lon → elevation (meters)
 * Returns null if outside ALL DEMs
 */
export function getElevationAtPoint(lat, lon) {
  for (const dem of datasets) {
    const { band, geoTransform, rasterX, rasterY } = dem;

    // Convert lon/lat → pixel
    const px = Math.floor((lon - geoTransform[0]) / geoTransform[1]);
    const py = Math.floor((lat - geoTransform[3]) / geoTransform[5]);

    // ⛔ Outside this DEM → try next
    if (px < 0 || py < 0 || px >= rasterX || py >= rasterY) {
      continue;
    }

    const value = band.pixels.read(px, py, 1, 1)[0];

    if (
      value === band.noDataValue ||
      value === undefined ||
      Number.isNaN(value)
    ) {
      continue;
    }

    // ✅ FOUND elevation
    return value;
  }

  // ❌ Outside all DEMs
  return null;
}
