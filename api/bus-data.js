// Fetches all bus stops and routes from LTA DataMall
// Bus routes are large (~17k records) so we paginate and cache aggressively

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
let cache = null;
let cacheTime = 0;

async function fetchAll(endpoint) {
  const results = [];
  let skip = 0;
  while (true) {
    const res = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/${endpoint}?$skip=${skip}`,
      { headers: { AccountKey: process.env.LTA_API_KEY } }
    );
    if (!res.ok) throw new Error(`DataMall ${endpoint} error: ${res.status}`);
    const data = await res.json();
    const batch = data.value || [];
    results.push(...batch);
    if (batch.length < 500) break;
    skip += 500;
  }
  return results;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=21600");

  try {
    // Use in-memory cache to avoid re-fetching on every cold start
    const now = Date.now();
    if (!cache || now - cacheTime > CACHE_TTL) {
      const [stops, routes] = await Promise.all([
        fetchAll("BusStops"),
        fetchAll("BusRoutes"),
      ]);

      // Build stop map: busStopCode -> { lat, lng, description }
      const stopMap = {};
      for (const s of stops) {
        stopMap[s.BusStopCode] = {
          lat: s.Latitude,
          lng: s.Longitude,
          name: s.Description,
        };
      }

      // Build route map: serviceNo -> sorted array of { stopCode, seq, distance }
      // Only direction 1 (outbound) for now — direction 2 is return
      // We keep both directions so routing works both ways
      const routeMap = {};
      for (const r of routes) {
        const key = `${r.ServiceNo}_${r.Direction}`;
        if (!routeMap[key]) routeMap[key] = [];
        routeMap[key].push({
          code: r.BusStopCode,
          seq: r.StopSequence,
          dist: r.Distance,
        });
      }
      // Sort each route by sequence
      for (const key of Object.keys(routeMap)) {
        routeMap[key].sort((a, b) => a.seq - b.seq);
      }

      cache = { stopMap, routeMap };
      cacheTime = now;
    }

    return res.status(200).json(cache);
  } catch (err) {
    console.error("bus-data error:", err);
    return res.status(500).json({ error: "Failed to fetch bus data" });
  }
}
