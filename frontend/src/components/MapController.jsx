import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    map.flyTo(center, 13, {
      animate: true,
      duration: 1.5,
    });
  }, [center, map]);

  return null;
}
