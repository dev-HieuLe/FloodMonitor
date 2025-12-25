import axios from "axios";
const FORCE_MOCK_RAIN = true;
export const getRainAtPoint = async (lat, lon, mockRain = null) => {
  if (FORCE_MOCK_RAIN) {
    console.warn("[RAIN] FORCE MOCK ENABLED");

    const rain1h = 10;
    const rain3h = 60;
    const rain6h = 40;
    const rain24h = 50;

    return {
      rain1h,
      rain3h,
      rain6h,
      rain24h,
      effectiveRain:
        rain1h * 0.5 + rain3h * 0.25 + rain6h * 0.15 + rain24h * 0.1,
      hourlyData: [],
    };
  }

  const params = {
    latitude: lat,
    longitude: lon,
    hourly: "precipitation",
    timezone: "Asia/Bangkok",
  };

  console.log(
    `[getRainAtPoint] Calling ${isHistorical ? "archive" : "forecast"} API`,
    `URL: ${url}`,
    `Params:`,
    params
  );

  try {
    const res = await axios.get(url, { params, timeout: 8000 });

    // Extract hourly precipitation
    const hourlyData = res.data.hourly || {};
    const rain = hourlyData.precipitation || [];
    const times = hourlyData.time || [];

    if (rain.length === 0) {
      return {
        rain1h: 0,
        rain3h: 0,
        rain6h: 0,
        rain24h: 0,
        effectiveRain: 0,
        hourlyData: [],
      };
    }

    // Optional: filter by specific hour range if needed
    const filteredRain = rain.map((v, i) => ({
      time: times[i],
      precipitation: v,
    }));

    const n = filteredRain.length;
    const sumLast = (h) =>
      filteredRain
        .slice(Math.max(0, n - h))
        .reduce((s, v) => s + v.precipitation, 0);

    const rain1h = sumLast(1);
    const rain3h = sumLast(3);
    const rain6h = sumLast(6);
    const rain24h = sumLast(24);

    const effectiveRain =
      rain1h * 0.5 + rain3h * 0.25 + rain6h * 0.15 + rain24h * 0.1;

    return {
      rain1h,
      rain3h,
      rain6h,
      rain24h,
      effectiveRain,
      hourlyData: filteredRain,
    };
  } catch (err) {
    console.error("Failed to fetch rain data:", err.message);
    return {
      rain1h: 0,
      rain3h: 0,
      rain6h: 0,
      rain24h: 0,
      effectiveRain: 0,
      hourlyData: [],
    };
  }
};
