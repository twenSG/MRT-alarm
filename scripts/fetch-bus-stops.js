// node scripts/fetch-bus-stops.js
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.LTA_API_KEY;
if (!API_KEY) { console.error("Set LTA_API_KEY env var"); process.exit(1); }

async function fetchAll(endpoint) {
  const results = [];
  let skip = 0;
  let page = 0;
  while (true) {
    page++;
    console.log(`  ${endpoint} page ${page} (skip=${skip})...`);
    const res = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/${endpoint}?$skip=${skip}`,
      { headers: { AccountKey: API_KEY } }
    );
    if (!res.ok) {
      console.error(`  ERROR ${res.status} on page ${page}`);
      throw new Error(`${endpoint} failed: ${res.status}`);
    }
    const data = await res.json();
    const batch = data.value || [];
    console.log(`  Got ${batch.length} records (total so far: ${results.length + batch.length})`);
    results.push(...batch);
    if (batch.length < 500) {
      console.log(`  Done — last batch had ${batch.length} records`);
      break;
    }
    skip += 500;
  }
  return results;
}

async function main() {
  console.log("Fetching BusStops...");
  const stopsRaw = await fetchAll("BusStops");
  console.log(`Total stops: ${stopsRaw.length}`);

  const stopMap = {};
  for (const s of stopsRaw) {
    stopMap[s.BusStopCode] = [s.Latitude, s.Longitude, s.Description];
  }
  const stopsOut = `// Auto-generated ${new Date().toISOString().slice(0,10)} — ${stopsRaw.length} stops\nconst BUS_STOPS = ${JSON.stringify(stopMap)};\nexport default BUS_STOPS;\n`;
  fs.writeFileSync(path.join(__dirname, "../src/busStops.js"), stopsOut);
  console.log(`busStops.js: ${Math.round(stopsOut.length/1024)}kb`);

  console.log("\nFetching BusRoutes...");
  const routesRaw = await fetchAll("BusRoutes");
  console.log(`Total route records: ${routesRaw.length}`);

  const tmp = {};
  for (const r of routesRaw) {
    const key = `${r.ServiceNo}_${r.Direction}`;
    if (!tmp[key]) tmp[key] = [];
    tmp[key].push({ c: r.BusStopCode, s: r.StopSequence });
  }
  const routeMap = {};
  for (const [key, stops] of Object.entries(tmp)) {
    routeMap[key] = stops.sort((a,b) => a.s - b.s).map(s => s.c);
  }
  const routesOut = `// Auto-generated ${new Date().toISOString().slice(0,10)} — ${routesRaw.length} records, ${Object.keys(routeMap).length} routes\nconst BUS_ROUTES = ${JSON.stringify(routeMap)};\nexport default BUS_ROUTES;\n`;
  fs.writeFileSync(path.join(__dirname, "../src/busRoutes.js"), routesOut);
  console.log(`busRoutes.js: ${Math.round(routesOut.length/1024)}kb`);
}

main().catch(err => { console.error(err); process.exit(1); });
