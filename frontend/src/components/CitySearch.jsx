import { useState } from "react";
import axios from "axios";

export default function CitySearch({ onSelect }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!value) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`/api/geocode`, {
        params: { q: value },
      });
      const data = res.data;

      if (!data.lat) {
        setError("City not found");
        return;
      }

      onSelect([data.lat, data.lon]);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <input
        className="border p-2 rounded w-64"
        placeholder="Enter city (e.g. Hanoi)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
      />

      <button
        onClick={search}
        className="w-full bg-blue-600 text-white py-1 rounded"
      >
        {loading ? "Searching..." : "Set City"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
