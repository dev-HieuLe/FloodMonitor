import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";
import axios from "axios";

export default function FloodRoadLayer({ cityCenter }) {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityCenter) return;

    let lat;
    let lon;

    // Object format: { lat, lng } or { lat, lon }
    if (typeof cityCenter === "object" && !Array.isArray(cityCenter)) {
      if ("lat" in cityCenter && "lng" in cityCenter) {
        lat = cityCenter.lat;
        lon = cityCenter.lng;
      } else if ("lat" in cityCenter && "lon" in cityCenter) {
        lat = cityCenter.lat;
        lon = cityCenter.lon;
      }
    }

    // Array format: [lat, lon]
    if (Array.isArray(cityCenter)) {
      lat = cityCenter[0];
      lon = cityCenter[1];
    }

    // HARD GUARD
    if (typeof lat !== "number" || typeof lon !== "number") {
      console.error("Invalid cityCenter:", cityCenter);
      return;
    }

    setLoading(true);
    console.log("Flood request params:", lat, lon);

    axios
      .get("/api/flood-roads", {
        params: { lat, lon },
      })
      .then((res) => {
        console.log("Flood API response:", res.data);

        // IMPORTANT FIX
        setSegments(Array.isArray(res.data?.segments) ? res.data.segments : []);
      })
      .catch((err) => {
        console.error("Flood road error:", err.response?.data || err);
        setSegments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cityCenter]);

  const getColor = (level) => {
    if (level === "high") return "red";
    if (level === "medium") return "orange";
    if (level === "low") return "blue";
    return null;
  };

  // Optional: show nothing while loading
  if (loading) return null;

  return (
    <>
      {Array.isArray(segments) &&
        segments.map((seg) => {
          const color = getColor(seg.floodLevel);
          if (!color || !Array.isArray(seg.coords)) return null;

          return (
            <Polyline
              key={`${seg.roadId}-${seg.segmentIndex}`}
              positions={seg.coords.map(([lat, lon]) => [
                Number(lat),
                Number(lon),
              ])}
              pathOptions={{
                color,
                weight: 4,
                opacity: 0.7,
              }}
            />
          );
        })}
    </>
  );
}
