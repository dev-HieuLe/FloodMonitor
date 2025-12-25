import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function RouteLayer({ start, end, onRouteFound, setLoading }) {
  const map = useMap();
  const [polylines, setPolylines] = useState([]);

  useEffect(() => {
    if (!start || !end) return;

    polylines.forEach((p) => map.removeLayer(p));
    setPolylines([]);
    setLoading(true);

    axios
      .get("/api/route", {
        params: {
          startLat: start.lat,
          startLon: start.lon,
          endLat: end.lat,
          endLon: end.lon,
        },
      })
      .then((res) => {
        const { best, alternatives } = res.data;

        if (!best) {
          onRouteFound(null);
          return;
        }

        const lines = [];

        const bestLine = L.polyline(best.geometry, {
          color: "#000000",
          weight: 6,
        }).addTo(map);

        lines.push(bestLine);

        alternatives.forEach((r) => {
          lines.push(
            L.polyline(r.geometry, {
              color: "#9ca3af",
              weight: 4,
              opacity: 0.5,
            }).addTo(map)
          );
        });

        setPolylines(lines);

        map.fitBounds(bestLine.getBounds(), {
          padding: [60, 60],
        });

        onRouteFound({
          distance: best.distance,
          duration: best.duration,
          trafficDelay: best.trafficDelay,
        });
      })
      .catch(() => onRouteFound(null))
      .finally(() => setLoading(false));

    return () => {
      polylines.forEach((p) => map.removeLayer(p));
    };
  }, [start, end]);

  return null;
}
