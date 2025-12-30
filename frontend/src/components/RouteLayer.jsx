import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

export default function RouteLayer({ start, end, onRouteFound, setLoading }) {
  const map = useMap();
  const [polylines, setPolylines] = useState([]);

  useEffect(() => {
    if (!start || !end) return;

    console.log("[ROUTE-LAYER] request route");
    console.log("[ROUTE-LAYER] start =", start);
    console.log("[ROUTE-LAYER] end =", end);

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
        console.log("[ROUTE-LAYER] API response received");

        // 🛑 HARD GUARD
        if (!res || !res.data) {
          console.log("[ROUTE-LAYER] no route found");
          onRouteFound(null);
          return;
        }

        const { best, alternatives } = res.data;

        if (!best) {
          console.log("[ROUTE-LAYER] no route found");
          onRouteFound(null);
          return;
        }

        console.log(
          "[ROUTE-LAYER] best route",
          "distance =",
          best.distance,
          "duration =",
          best.duration
        );

        const lines = [];

        const bestLine = L.polyline(best.geometry, {
          color: "#000000",
          weight: 6,
        }).addTo(map);

        lines.push(bestLine);

        if (Array.isArray(alternatives)) {
          alternatives.forEach((r, i) => {
            console.log("[ROUTE-LAYER] alternative", i, r.distance);
            lines.push(
              L.polyline(r.geometry, {
                color: "#9ca3af",
                weight: 4,
                opacity: 0.5,
              }).addTo(map)
            );
          });
        }

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
      .catch((err) => {
        console.error("[ROUTE-LAYER] API error", err);
        onRouteFound(null);
      })
      .finally(() => {
        console.log("[ROUTE-LAYER] route done");
        setLoading(false);
      });

    return () => {
      polylines.forEach((p) => map.removeLayer(p));
    };
  }, [start, end]);

  return null;
}
