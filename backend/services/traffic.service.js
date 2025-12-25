import axios from "axios";

/**
 * Evaluate traffic time using TomTom
 * Uses sparse waypoints, NOT full geometry
 */
export async function evaluateTraffic(coords) {
  if (!coords || coords.length < 2) {
    return {
      duration: 0,
      trafficDelay: 0,
    };
  }

  // 🔴 TomTom limit
  const MAX_POINTS = 25;

  // Always include start & end
  let sampled = [coords[0], coords[coords.length - 1]];

  // Add middle points if possible
  if (coords.length > 2 && MAX_POINTS > 2) {
    const step = Math.floor(coords.length / (MAX_POINTS - 1));
    for (let i = step; i < coords.length - 1; i += step) {
      sampled.splice(sampled.length - 1, 0, coords[i]);
      if (sampled.length >= MAX_POINTS) break;
    }
  }

  const locations = sampled.map(([lat, lng]) => `${lat},${lng}`).join(":");

  const url = `https://api.tomtom.com/routing/1/calculateRoute/${locations}/json`;

  try {
    const res = await axios.get(url, {
      params: {
        key: process.env.TOMTOM_API_KEY,
        traffic: true,
        routeType: "fastest",
        travelMode: "car",
      },
      timeout: 8000,
    });

    const summary = res.data.routes[0].summary;

    return {
      duration: summary.travelTimeInSeconds,
      trafficDelay: summary.trafficDelayInSeconds || 0,
    };
  } catch (err) {
    console.error("TomTom error:", err.response?.data || err.message);

    // 🧠 Fail-safe: return distance-based estimate
    return {
      duration: Math.round(coords.length * 2), // fallback
      trafficDelay: 0,
    };
  }
}
