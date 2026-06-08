export default async function handler(req, res) {
  const { postal } = req.query;
  if (!postal || postal.length !== 6) {
    return res.status(400).json({ error: "Invalid postal code" });
  }

  try {
    const upstream = await fetch(
      `https://developers.onemap.sg/commonapi/search?searchVal=${encodeURIComponent(postal)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );
    const data = await upstream.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "Postal code not found" });
    }

    const r = data.results[0];
    return res.status(200).json({
      lat: parseFloat(r.LATITUDE),
      lng: parseFloat(r.LONGITUDE),
      address: r.ADDRESS,
    });
  } catch (err) {
    return res.status(500).json({ error: "Geocoding failed" });
  }
}
