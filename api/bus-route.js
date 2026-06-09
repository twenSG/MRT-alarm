// Computes a mixed MRT+bus route between two lat/lng points
// Runs server-side so the client doesn't need to download the full bus graph

const NEARBY_RADIUS_M = 600; // how far to look for bus stops near origin/destination
const BUS_MIN_PER_STOP = 3;  // estimated minutes per bus stop
const MRT_MIN_PER_STOP = 2;  // estimated minutes per MRT stop
const TRANSFER_PENALTY = 5;  // extra minutes per transfer

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function stopsNear(lat, lng, stopMap, radiusM) {
  return Object.entries(stopMap)
    .filter(([, s]) => haversineM(lat, lng, s.lat, s.lng) <= radiusM)
    .map(([code, s]) => ({ code, ...s, distFromPoint: haversineM(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.distFromPoint - b.distFromPoint)
    .slice(0, 20); // cap at 20 nearest stops
}

function findBusRoutes(originStops, destStops, routeMap, stopMap) {
  const originCodes = new Set(originStops.map(s => s.code));
  const destCodes = new Set(destStops.map(s => s.code));
  const routes = [];

  for (const [key, stops] of Object.entries(routeMap)) {
    const [serviceNo, direction] = key.split("_");
    
    // Find if this route passes through both an origin stop and a dest stop (in order)
    let originIdx = -1;
    let destIdx = -1;
    
    for (let i = 0; i < stops.length; i++) {
      if (originCodes.has(stops[i].code) && originIdx === -1) {
        originIdx = i;
      }
      if (destCodes.has(stops[i].code) && originIdx !== -1 && i > originIdx) {
        destIdx = i;
        break;
      }
    }

    if (originIdx !== -1 && destIdx !== -1) {
      const stopCount = destIdx - originIdx;
      const estMins = stopCount * BUS_MIN_PER_STOP;
      const leg = stops.slice(originIdx, destIdx + 1);
      
      routes.push({
        type: "bus",
        serviceNo,
        direction: parseInt(direction),
        from: { code: stops[originIdx].code, ...stopMap[stops[originIdx].code] },
        to: { code: stops[destIdx].code, ...stopMap[stops[destIdx].code] },
        stops: leg.map(s => ({ code: s.code, ...(stopMap[s.code] || {}) })),
        stopCount,
        estMins,
        transfers: 0,
      });
    }
  }

  // Sort by estimated time, deduplicate by serviceNo keeping shortest
  const seen = new Map();
  for (const r of routes.sort((a, b) => a.estMins - b.estMins)) {
    if (!seen.has(r.serviceNo)) seen.set(r.serviceNo, r);
  }

  return Array.from(seen.values()).slice(0, 5);
}

export default async function handler(req, res) {
  const { oLat, oLng, dLat, dLng } = req.query;
  if (!oLat || !oLng || !dLat || !dLng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    // Fetch bus data from our own cache endpoint
    const busRes = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/bus-data`);
    if (!busRes.ok) throw new Error("bus-data fetch failed");
    const { stopMap, routeMap } = await busRes.json();

    const originStops = stopsNear(parseFloat(oLat), parseFloat(oLng), stopMap, NEARBY_RADIUS_M);
    const destStops   = stopsNear(parseFloat(dLat), parseFloat(dLng), stopMap, NEARBY_RADIUS_M);

    if (!originStops.length || !destStops.length) {
      return res.status(200).json({ routes: [], reason: "No bus stops found nearby" });
    }

    const routes = findBusRoutes(originStops, destStops, routeMap, stopMap);

    return res.status(200).json({
      routes,
      originStops: originStops.slice(0, 5),
      destStops: destStops.slice(0, 5),
    });
  } catch (err) {
    console.error("route error:", err);
    return res.status(500).json({ error: "Route computation failed" });
  }
}
