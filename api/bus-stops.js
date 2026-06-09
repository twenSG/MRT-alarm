// Returns only bus stop data (code → name/lat/lng)
// Much lighter than bus-data.js — ~5k records vs ~17k for routes
// Used for immediate stop code validation in the UI

let cache = null;
let cacheTime = 0;
const TTL = 12 * 60 * 60 * 1000; // 12 hours

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=43200");

  try {
    const now = Date.now();
    if (!cache || now - cacheTime > TTL) {
      let stops = [];
      let skip = 0;
      while (true) {
        const r = await fetch(
          `https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`,
          { headers: { AccountKey: process.env.LTA_API_KEY } }
        );
        if (!r.ok) throw new Error(`BusStops error: ${r.status}`);
        const data = await r.json();
        const batch = data.value || [];
        stops = stops.concat(batch);
        if (batch.length < 500) break;
        skip += 500;
      }

      const stopMap = {};
      for (const s of stops) {
        stopMap[s.BusStopCode] = {
          name: s.Description,
          lat: s.Latitude,
          lng: s.Longitude,
        };
      }
      cache = stopMap;
      cacheTime = now;
    }

    return res.status(200).json(cache);
  } catch (err) {
    console.error("bus-stops error:", err);
    return res.status(500).json({ error: "Failed to fetch bus stops" });
  }
}
