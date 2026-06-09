// Computes bus routes between two lat/lng points
// Fetches stops and routes separately to stay within Vercel's 10s limit

const NEARBY_RADIUS_M = 600;
const BUS_MIN_PER_STOP = 3;

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function stopsNear(lat, lng, stopMap, radiusM) {
  return Object.entries(stopMap)
    .filter(([, s]) => haversineM(lat, lng, s.lat, s.lng) <= radiusM)
    .map(([code, s]) => ({ code, ...s, distFromPoint: haversineM(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.distFromPoint - b.distFromPoint)
    .slice(0, 30);
}

async function fetchAllPages(endpoint, apiKey) {
  const results = [];
  let skip = 0;
  while (true) {
    const r = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/${endpoint}?$skip=${skip}`,
      { headers: { AccountKey: apiKey } }
    );
    if (!r.ok) throw new Error(`${endpoint} error: ${r.status}`);
    const data = await r.json();
    const batch = data.value || [];
    results.push(...batch);
    if (batch.length < 500) break;
    skip += 500;
  }
  return results;
}

// In-memory cache for routes (heavy data)
let routeCache = null;
let routeCacheTime = 0;
const ROUTE_TTL = 6 * 60 * 60 * 1000;

export default async function handler(req, res) {
  const { oLat, oLng, dLat, dLng } = req.query;
  if (!oLat || !oLng || !dLat || !dLng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const apiKey = process.env.LTA_API_KEY;

    // Fetch stops (fast, ~5k records)
    const stopsRaw = await fetchAllPages("BusStops", apiKey);
    const stopMap = {};
    for (const s of stopsRaw) {
      stopMap[s.BusStopCode] = { name: s.Description, lat: s.Latitude, lng: s.Longitude };
    }

    const originStops = stopsNear(parseFloat(oLat), parseFloat(oLng), stopMap, NEARBY_RADIUS_M);
    const destStops   = stopsNear(parseFloat(dLat), parseFloat(dLng), stopMap, NEARBY_RADIUS_M);

    if (!originStops.length || !destStops.length) {
      return res.status(200).json({ routes: [], reason: "No bus stops found nearby" });
    }

    // Fetch routes (heavy, ~17k records) — use cache if available
    const now = Date.now();
    if (!routeCache || now - routeCacheTime > ROUTE_TTL) {
      const routesRaw = await fetchAllPages("BusRoutes", apiKey);
      const routeMap = {};
      for (const r of routesRaw) {
        const key = `${r.ServiceNo}_${r.Direction}`;
        if (!routeMap[key]) routeMap[key] = [];
        routeMap[key].push({ code: r.BusStopCode, seq: r.StopSequence, dist: r.Distance });
      }
      for (const key of Object.keys(routeMap)) {
        routeMap[key].sort((a, b) => a.seq - b.seq);
      }
      routeCache = routeMap;
      routeCacheTime = now;
    }

    // Find routes that serve both origin and destination stops in order
    const originCodes = new Set(originStops.map(s => s.code));
    const destCodes   = new Set(destStops.map(s => s.code));
    const found = [];

    for (const [key, stops] of Object.entries(routeCache)) {
      const [serviceNo] = key.split("_");
      let originIdx = -1, destIdx = -1;
      for (let i = 0; i < stops.length; i++) {
        if (originCodes.has(stops[i].code) && originIdx === -1) originIdx = i;
        if (destCodes.has(stops[i].code) && originIdx !== -1 && i > originIdx) { destIdx = i; break; }
      }
      if (originIdx !== -1 && destIdx !== -1) {
        const stopCount = destIdx - originIdx;
        const fromStop = stopMap[stops[originIdx].code];
        const toStop   = stopMap[stops[destIdx].code];
        const leg = stops.slice(originIdx, destIdx+1).map(s => ({ code: s.code, ...(stopMap[s.code] || {}) }));
        found.push({
          serviceNo,
          from: { code: stops[originIdx].code, ...fromStop },
          to:   { code: stops[destIdx].code,   ...toStop },
          stops: leg,
          stopCount,
          estMins: stopCount * BUS_MIN_PER_STOP,
        });
      }
    }

    // Deduplicate by serviceNo keeping shortest, sort by estimated time
    const seen = new Map();
    for (const r of found.sort((a, b) => a.estMins - b.estMins)) {
      if (!seen.has(r.serviceNo)) seen.set(r.serviceNo, r);
    }

    return res.status(200).json({
      routes: Array.from(seen.values()).slice(0, 8),
      originStops: originStops.slice(0, 6),
      destStops:   destStops.slice(0, 6),
    });
  } catch (err) {
    console.error("bus-route error:", err);
    return res.status(500).json({ error: err.message || "Route computation failed" });
  }
}
