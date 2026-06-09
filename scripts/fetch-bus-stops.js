// Run once: node scripts/fetch-bus-stops.js
// Fetches all bus stops AND routes from LTA DataMall and writes as static JS modules

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.LTA_API_KEY;
if (!API_KEY) { console.error("Set LTA_API_KEY env var"); process.exit(1); }

async function fetchAll(endpoint) {
  const results = [];
  let skip = 0;
  while (true) {
    const res = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/${endpoint}?$skip=${skip}`,
      { headers: { AccountKey: API_KEY } }
    );
    if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
    const data = await res.json();
    const batch = data.value || [];
    results.push(...batch);
    process.stdout.write(`\r${endpoint}: ${results.length} records...`);
    if (batch.length < 500) break;
    skip += 500;
  }
  console.log(` done.`);
  return results;
}

async function main() {
  // Fetch stops
  const stopsRaw = await fetchAll("BusStops");
  const stopMap = {};
  for (const s of stopsRaw) {
    stopMap[s.BusStopCode] = [s.Latitude, s.Longitude, s.Description];
  }

  const stopsOut = `// Auto-generated — do not edit manually
// Last updated: ${new Date().toISOString().slice(0,10)} — ${stopsRaw.length} stops
// Format: { "StopCode": [lat, lng, "Name"] }
const BUS_STOPS = ${JSON.stringify(stopMap)};
export default BUS_STOPS;
`;
  fs.writeFileSync(path.join(__dirname, "../src/busStops.js"), stopsOut);
  console.log(`Wrote busStops.js (${Math.round(stopsOut.length/1024)}kb)`);

  // Fetch routes
  const routesRaw = await fetchAll("BusRoutes");

  // Compact format: { "ServiceNo_Direction": ["stop1","stop2",...] }
  // Only store stop codes in sequence — we look up lat/lng from stopMap at runtime
  const routeMap = {};
  for (const r of routesRaw) {
    const key = `${r.ServiceNo}_${r.Direction}`;
    if (!routeMap[key]) routeMap[key] = [];
    routeMap[key].push({ c: r.BusStopCode, s: r.StopSequence });
  }
  // Sort by sequence and keep only stop codes
  const compactRoutes = {};
  for (const [key, stops] of Object.entries(routeMap)) {
    compactRoutes[key] = stops.sort((a,b) => a.s - b.s).map(s => s.c);
  }

  const routesOut = `// Auto-generated — do not edit manually
// Last updated: ${new Date().toISOString().slice(0,10)} — ${routesRaw.length} records
// Format: { "ServiceNo_Direction": ["stopCode1","stopCode2",...] }
const BUS_ROUTES = ${JSON.stringify(compactRoutes)};
export default BUS_ROUTES;
`;
  fs.writeFileSync(path.join(__dirname, "../src/busRoutes.js"), routesOut);
  console.log(`Wrote busRoutes.js (${Math.round(routesOut.length/1024)}kb)`);
}

main().catch(err => { console.error(err); process.exit(1); });
