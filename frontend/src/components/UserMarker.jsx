import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function UserMarker({ position }) {
  return (
    <Marker position={[position.lat, position.lon]} icon={icon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
