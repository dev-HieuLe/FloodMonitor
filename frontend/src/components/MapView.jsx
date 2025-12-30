import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import axios from "axios";
import CitySearch from "./CitySearch";
import LocationSearch from "./LocationSearch";
import MapController from "./MapController";
import RouteLayer from "./RouteLayer";
import UserMarker from "./UserMarker";
import FloodRoadLayer from "./FloodLayer";

// 🔹 Debounce hook (LOCAL, SAFE)
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function MapView() {
  const [cityCenter, setCityCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [startText, setStartText] = useState("");
  const [destText, setDestText] = useState("");

  const [routeStart, setRouteStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const [noRouteAlert, setNoRouteAlert] = useState(false);
  const [longRouteAlert, setLongRouteAlert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  const debouncedStartText = useDebouncedValue(startText, 300);
  const debouncedDestText = useDebouncedValue(destText, 300);

  // Request GPS once
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.code === 1 ? "denied" : "unavailable");
      }
    );
  }, []);

  useEffect(() => {
    if (cityCenter) {
      console.log("cityCenter value:", cityCenter);
      console.log("cityCenter type:", typeof cityCenter);
    }
  }, [cityCenter]);

  // Geocode text -> lat/lon
  const geocode = async (query) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        { params: { format: "json", q: query, limit: 1 } }
      );
      if (!res.data.length) return null;

      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
      };
    } catch (err) {
      console.error("Geocode error:", err);
      return null;
    }
  };

  // Route button
  const handleRoute = async () => {
    setNoRouteAlert(false);
    setLongRouteAlert(false);
    setRouteInfo(null);
    setLoading(true);

    const start =
      userLocation ||
      (debouncedStartText ? await geocode(debouncedStartText) : null);
    const end = debouncedDestText ? await geocode(debouncedDestText) : null;

    if (!start || !end) {
      alert("Invalid start or destination");
      setLoading(false);
      return;
    }

    setRouteStart(start);
    setDestination(end);
  };

  // Callback when RouteLayer finds route
  const handleRouteFound = (info) => {
    if (!info) {
      setNoRouteAlert(true);
      setRouteInfo(null);
      return;
    }

    setRouteInfo(info);

    if (info.duration > 5400) {
      setLongRouteAlert(true);
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded shadow space-y-3 w-72">
        <CitySearch onSelect={setCityCenter} />

        {!userLocation && (
          <LocationSearch
            placeholder="Start location"
            value={startText}
            onChange={setStartText}
          />
        )}

        <LocationSearch
          placeholder="Destination"
          value={destText}
          onChange={setDestText}
        />

        <button
          onClick={handleRoute}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Route
        </button>

        {!userLocation && (
          <p className="text-xs text-gray-500">
            GPS denied — using typed start location
          </p>
        )}
      </div>

      {/* 🚨 NO ROUTE ALERT (RESTORED) */}
      {noRouteAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1600] bg-red-100 border border-red-300 p-3 rounded shadow text-sm max-w-md flex justify-between items-start">
          <div>
            <strong>No available route found</strong>
            <p className="mt-1">
              All possible routes are blocked due to floods or extreme
              conditions.
            </p>
          </div>
          <button
            onClick={() => setNoRouteAlert(false)}
            className="text-red-500 font-bold ml-4 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* ⚠️ LONG ROUTE ALERT */}
      {longRouteAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1600] bg-yellow-100 border border-yellow-300 p-3 rounded shadow text-sm max-w-md">
          <strong>Long route warning</strong>
          <p className="mt-1">
            The estimated travel time is more than 1 hour 30 minutes.
          </p>
        </div>
      )}

      {/* Flood map loading overlay */}
      {mapLoading && (
        <div className="absolute inset-0 z-[1500] bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-4 rounded shadow flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Loading flood data…</span>
          </div>
        </div>
      )}

      {/* Route loading */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[16.0471, 108.2068]}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {cityCenter && <MapController center={cityCenter} />}
        {userLocation && <UserMarker position={userLocation} />}

        {cityCenter && (
          <FloodRoadLayer
            cityCenter={cityCenter}
            setMapLoading={setMapLoading}
          />
        )}

        {routeStart && destination && (
          <RouteLayer
            start={routeStart}
            end={destination}
            onRouteFound={handleRouteFound}
            setLoading={setLoading}
          />
        )}
      </MapContainer>
    </div>
  );
}
