export default async function handler(req, res) {
  // Cache for 24 hours — stations don't change often
  res.setHeader("Cache-Control", "public, max-age=86400");

  try {
    let allStations = [];
    let skip = 0;

    // DataMall paginates at 500 records — loop until we have everything
    while (true) {
      const r = await fetch(
        `https://datamall2.mytransport.sg/ltaodataservice/TrainStation?$skip=${skip}`,
        { headers: { AccountKey: process.env.LTA_API_KEY } }
      );
      if (!r.ok) throw new Error(`DataMall error: ${r.status}`);
      const data = await r.json();
      const batch = data.value || [];
      allStations = allStations.concat(batch);
      if (batch.length < 500) break;
      skip += 500;
    }

    // Return as a simple map: stationCode -> { lat, lng, name }
    const result = {};
    for (const s of allStations) {
      result[s.StationCode] = {
        name: s.StationName,
        lat: s.Latitude,
        lng: s.Longitude,
      };
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("stations error:", err);
    return res.status(500).json({ error: "Failed to fetch station data" });
  }
}
