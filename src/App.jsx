import { useState, useEffect, useRef } from "react";
import BUS_STOPS from "./busStops.js";
import BUS_ROUTES from "./busRoutes.js";

// ─── MRT STATION DATABASE ────────────────────────────────────────────────────
const STATIONS = [
  // NSL
  { code:"NS1",  name:"Jurong East",       lat:1.3332, lng:103.7420, lines:["NSL","EWL"] },
  { code:"NS2",  name:"Bukit Batok",       lat:1.3490, lng:103.7496, lines:["NSL"] },
  { code:"NS3",  name:"Bukit Gombak",      lat:1.3587, lng:103.7516, lines:["NSL"] },
  { code:"NS4",  name:"Choa Chu Kang",     lat:1.3854, lng:103.7443, lines:["NSL","LRT"] },
  { code:"NS5",  name:"Yew Tee",           lat:1.3970, lng:103.7474, lines:["NSL"] },
  { code:"NS7",  name:"Kranji",            lat:1.4252, lng:103.7620, lines:["NSL"] },
  { code:"NS8",  name:"Marsiling",         lat:1.4326, lng:103.7742, lines:["NSL"] },
  { code:"NS9",  name:"Woodlands",         lat:1.4371, lng:103.7865, lines:["NSL","TEL"] },
  { code:"NS10", name:"Admiralty",         lat:1.4408, lng:103.8008, lines:["NSL"] },
  { code:"NS11", name:"Sembawang",         lat:1.4490, lng:103.8202, lines:["NSL"] },
  { code:"NS12", name:"Canberra",          lat:1.4431, lng:103.8297, lines:["NSL"] },
  { code:"NS13", name:"Yishun",            lat:1.4295, lng:103.8352, lines:["NSL"] },
  { code:"NS14", name:"Khatib",            lat:1.4172, lng:103.8329, lines:["NSL"] },
  { code:"NS15", name:"Yio Chu Kang",      lat:1.3816, lng:103.8449, lines:["NSL"] },
  { code:"NS16", name:"Ang Mo Kio",        lat:1.3700, lng:103.8495, lines:["NSL"] },
  { code:"NS17", name:"Bishan",            lat:1.3510, lng:103.8484, lines:["NSL","CCL"] },
  { code:"NS18", name:"Braddell",          lat:1.3400, lng:103.8469, lines:["NSL"] },
  { code:"NS19", name:"Toa Payoh",         lat:1.3325, lng:103.8474, lines:["NSL"] },
  { code:"NS20", name:"Novena",            lat:1.3204, lng:103.8437, lines:["NSL"] },
  { code:"NS21", name:"Newton",            lat:1.3131, lng:103.8384, lines:["NSL","DTL"] },
  { code:"NS22", name:"Orchard",           lat:1.3040, lng:103.8318, lines:["NSL","TEL"] },
  { code:"NS23", name:"Somerset",          lat:1.3006, lng:103.8389, lines:["NSL"] },
  { code:"NS24", name:"Dhoby Ghaut",       lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"NS25", name:"City Hall",         lat:1.2931, lng:103.8520, lines:["NSL","EWL"] },
  { code:"NS26", name:"Raffles Place",     lat:1.2840, lng:103.8516, lines:["NSL","EWL"] },
  { code:"NS27", name:"Marina Bay",        lat:1.2764, lng:103.8546, lines:["NSL","CEL","TEL"] },
  { code:"NS28", name:"Marina South Pier", lat:1.2706, lng:103.8631, lines:["NSL"] },
  // EWL
  { code:"EW1",  name:"Pasir Ris",         lat:1.3731, lng:103.9494, lines:["EWL"] },
  { code:"EW2",  name:"Tampines",          lat:1.3529, lng:103.9454, lines:["EWL","DTL"] },
  { code:"EW3",  name:"Simei",             lat:1.3432, lng:103.9531, lines:["EWL"] },
  { code:"EW4",  name:"Tanah Merah",       lat:1.3273, lng:103.9462, lines:["EWL","CGL"] },
  { code:"EW5",  name:"Bedok",             lat:1.3240, lng:103.9300, lines:["EWL"] },
  { code:"EW6",  name:"Kembangan",         lat:1.3209, lng:103.9126, lines:["EWL"] },
  { code:"EW7",  name:"Eunos",             lat:1.3197, lng:103.9027, lines:["EWL"] },
  { code:"EW8",  name:"Paya Lebar",        lat:1.3180, lng:103.8922, lines:["EWL","CCL"] },
  { code:"EW9",  name:"Aljunied",          lat:1.3164, lng:103.8828, lines:["EWL"] },
  { code:"EW10", name:"Kallang",           lat:1.3112, lng:103.8714, lines:["EWL"] },
  { code:"EW11", name:"Lavender",          lat:1.3072, lng:103.8630, lines:["EWL"] },
  { code:"EW12", name:"Bugis",             lat:1.3006, lng:103.8564, lines:["EWL","DTL"] },
  { code:"EW13", name:"City Hall",         lat:1.2931, lng:103.8520, lines:["NSL","EWL"] },
  { code:"EW14", name:"Raffles Place",     lat:1.2840, lng:103.8516, lines:["NSL","EWL"] },
  { code:"EW15", name:"Tanjong Pagar",     lat:1.2764, lng:103.8455, lines:["EWL"] },
  { code:"EW16", name:"Outram Park",       lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"EW17", name:"Tiong Bahru",       lat:1.2864, lng:103.8274, lines:["EWL"] },
  { code:"EW18", name:"Redhill",           lat:1.2895, lng:103.8167, lines:["EWL"] },
  { code:"EW19", name:"Queenstown",        lat:1.2944, lng:103.8060, lines:["EWL"] },
  { code:"EW20", name:"Commonwealth",      lat:1.3022, lng:103.7981, lines:["EWL"] },
  { code:"EW21", name:"Buona Vista",       lat:1.3073, lng:103.7899, lines:["EWL","CCL"] },
  { code:"EW22", name:"Dover",             lat:1.3113, lng:103.7784, lines:["EWL"] },
  { code:"EW23", name:"Clementi",          lat:1.3153, lng:103.7651, lines:["EWL"] },
  { code:"EW24", name:"Jurong East",       lat:1.3332, lng:103.7420, lines:["NSL","EWL"] },
  { code:"EW25", name:"Chinese Garden",    lat:1.3423, lng:103.7322, lines:["EWL"] },
  { code:"EW26", name:"Lakeside",          lat:1.3441, lng:103.7207, lines:["EWL"] },
  { code:"EW27", name:"Boon Lay",          lat:1.3388, lng:103.7060, lines:["EWL"] },
  { code:"EW28", name:"Pioneer",           lat:1.3376, lng:103.6972, lines:["EWL"] },
  { code:"EW29", name:"Joo Koon",          lat:1.3278, lng:103.6786, lines:["EWL"] },
  { code:"EW30", name:"Gul Circle",        lat:1.3196, lng:103.6609, lines:["EWL"] },
  { code:"EW31", name:"Tuas Crescent",     lat:1.3208, lng:103.6484, lines:["EWL"] },
  { code:"EW32", name:"Tuas West Road",    lat:1.3306, lng:103.6388, lines:["EWL"] },
  { code:"EW33", name:"Tuas Link",         lat:1.3402, lng:103.6368, lines:["EWL"] },
  // NEL
  { code:"NE1",  name:"HarbourFront",      lat:1.2653, lng:103.8218, lines:["NEL","CCL"] },
  { code:"NE3",  name:"Outram Park",       lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"NE4",  name:"Chinatown",         lat:1.2844, lng:103.8444, lines:["NEL","DTL"] },
  { code:"NE5",  name:"Clarke Quay",       lat:1.2883, lng:103.8467, lines:["NEL"] },
  { code:"NE6",  name:"Dhoby Ghaut",       lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"NE7",  name:"Little India",      lat:1.3066, lng:103.8494, lines:["NEL","DTL"] },
  { code:"NE8",  name:"Farrer Park",       lat:1.3121, lng:103.8544, lines:["NEL"] },
  { code:"NE9",  name:"Boon Keng",         lat:1.3198, lng:103.8617, lines:["NEL"] },
  { code:"NE10", name:"Potong Pasir",      lat:1.3316, lng:103.8695, lines:["NEL"] },
  { code:"NE11", name:"Woodleigh",         lat:1.3393, lng:103.8706, lines:["NEL"] },
  { code:"NE12", name:"Serangoon",         lat:1.3499, lng:103.8737, lines:["NEL","CCL"] },
  { code:"NE13", name:"Kovan",             lat:1.3600, lng:103.8852, lines:["NEL"] },
  { code:"NE14", name:"Hougang",           lat:1.3714, lng:103.8924, lines:["NEL"] },
  { code:"NE15", name:"Buangkok",          lat:1.3829, lng:103.8928, lines:["NEL"] },
  { code:"NE16", name:"Sengkang",          lat:1.3916, lng:103.8952, lines:["NEL","LRT"] },
  { code:"NE17", name:"Punggol",           lat:1.4053, lng:103.9022, lines:["NEL","LRT"] },
  // CCL
  { code:"CC1",  name:"Dhoby Ghaut",       lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"CC2",  name:"Bras Basah",        lat:1.2966, lng:103.8503, lines:["CCL"] },
  { code:"CC3",  name:"Esplanade",         lat:1.2934, lng:103.8555, lines:["CCL"] },
  { code:"CC4",  name:"Promenade",         lat:1.2934, lng:103.8612, lines:["CCL","DTL"] },
  { code:"CC5",  name:"Nicoll Highway",    lat:1.2997, lng:103.8635, lines:["CCL"] },
  { code:"CC6",  name:"Stadium",           lat:1.3028, lng:103.8751, lines:["CCL"] },
  { code:"CC7",  name:"Mountbatten",       lat:1.3063, lng:103.8826, lines:["CCL"] },
  { code:"CC8",  name:"Dakota",            lat:1.3086, lng:103.8883, lines:["CCL"] },
  { code:"CC9",  name:"Paya Lebar",        lat:1.3180, lng:103.8922, lines:["EWL","CCL"] },
  { code:"CC10", name:"MacPherson",        lat:1.3267, lng:103.8900, lines:["CCL","DTL"] },
  { code:"CC11", name:"Tai Seng",          lat:1.3355, lng:103.8878, lines:["CCL"] },
  { code:"CC12", name:"Bartley",           lat:1.3424, lng:103.8795, lines:["CCL"] },
  { code:"CC13", name:"Serangoon",         lat:1.3499, lng:103.8737, lines:["NEL","CCL"] },
  { code:"CC14", name:"Lorong Chuan",      lat:1.3526, lng:103.8659, lines:["CCL"] },
  { code:"CC15", name:"Bishan",            lat:1.3510, lng:103.8484, lines:["NSL","CCL"] },
  { code:"CC16", name:"Marymount",         lat:1.3490, lng:103.8396, lines:["CCL"] },
  { code:"CC17", name:"Caldecott",         lat:1.3374, lng:103.8396, lines:["CCL","TEL"] },
  { code:"CC19", name:"Botanic Gardens",   lat:1.3223, lng:103.8154, lines:["CCL","DTL"] },
  { code:"CC20", name:"Farrer Road",       lat:1.3172, lng:103.8072, lines:["CCL"] },
  { code:"CC21", name:"Holland Village",   lat:1.3118, lng:103.7961, lines:["CCL"] },
  { code:"CC22", name:"Buona Vista",       lat:1.3073, lng:103.7899, lines:["EWL","CCL"] },
  { code:"CC23", name:"one-north",         lat:1.2993, lng:103.7873, lines:["CCL"] },
  { code:"CC24", name:"Kent Ridge",        lat:1.2933, lng:103.7844, lines:["CCL"] },
  { code:"CC25", name:"Haw Par Villa",     lat:1.2826, lng:103.7820, lines:["CCL"] },
  { code:"CC26", name:"Pasir Panjang",     lat:1.2760, lng:103.7918, lines:["CCL"] },
  { code:"CC27", name:"Labrador Park",     lat:1.2723, lng:103.8022, lines:["CCL"] },
  { code:"CC28", name:"Telok Blangah",     lat:1.2706, lng:103.8096, lines:["CCL"] },
  { code:"CC29", name:"HarbourFront",      lat:1.2653, lng:103.8218, lines:["NEL","CCL"] },
  // DTL
  { code:"DT1",  name:"Bukit Panjang",     lat:1.3784, lng:103.7761, lines:["DTL"] },
  { code:"DT2",  name:"Cashew",            lat:1.3695, lng:103.7749, lines:["DTL"] },
  { code:"DT3",  name:"Hillview",          lat:1.3620, lng:103.7673, lines:["DTL"] },
  { code:"DT5",  name:"Beauty World",      lat:1.3411, lng:103.7759, lines:["DTL"] },
  { code:"DT6",  name:"King Albert Park",  lat:1.3354, lng:103.7832, lines:["DTL"] },
  { code:"DT7",  name:"Sixth Avenue",      lat:1.3309, lng:103.7956, lines:["DTL"] },
  { code:"DT8",  name:"Tan Kah Kee",       lat:1.3257, lng:103.8076, lines:["DTL"] },
  { code:"DT9",  name:"Botanic Gardens",   lat:1.3223, lng:103.8154, lines:["CCL","DTL"] },
  { code:"DT10", name:"Stevens",           lat:1.3201, lng:103.8260, lines:["DTL","TEL"] },
  { code:"DT11", name:"Newton",            lat:1.3131, lng:103.8384, lines:["NSL","DTL"] },
  { code:"DT12", name:"Little India",      lat:1.3066, lng:103.8494, lines:["NEL","DTL"] },
  { code:"DT13", name:"Rochor",            lat:1.3038, lng:103.8524, lines:["DTL"] },
  { code:"DT14", name:"Bugis",             lat:1.3006, lng:103.8564, lines:["EWL","DTL"] },
  { code:"DT15", name:"Promenade",         lat:1.2934, lng:103.8612, lines:["CCL","DTL"] },
  { code:"DT16", name:"Bayfront",          lat:1.2822, lng:103.8593, lines:["DTL","CEL"] },
  { code:"DT17", name:"Downtown",          lat:1.2795, lng:103.8529, lines:["DTL"] },
  { code:"DT18", name:"Telok Ayer",        lat:1.2822, lng:103.8481, lines:["DTL"] },
  { code:"DT19", name:"Chinatown",         lat:1.2844, lng:103.8444, lines:["NEL","DTL"] },
  { code:"DT20", name:"Fort Canning",      lat:1.2913, lng:103.8444, lines:["DTL"] },
  { code:"DT21", name:"Bendemeer",         lat:1.3136, lng:103.8630, lines:["DTL"] },
  { code:"DT22", name:"Geylang Bahru",     lat:1.3213, lng:103.8713, lines:["DTL"] },
  { code:"DT23", name:"Mattar",            lat:1.3271, lng:103.8830, lines:["DTL"] },
  { code:"DT24", name:"MacPherson",        lat:1.3267, lng:103.8900, lines:["CCL","DTL"] },
  { code:"DT25", name:"Ubi",               lat:1.3298, lng:103.8997, lines:["DTL"] },
  { code:"DT26", name:"Kaki Bukit",        lat:1.3352, lng:103.9091, lines:["DTL"] },
  { code:"DT27", name:"Bedok North",       lat:1.3340, lng:103.9194, lines:["DTL"] },
  { code:"DT28", name:"Bedok Reservoir",   lat:1.3363, lng:103.9324, lines:["DTL"] },
  { code:"DT29", name:"Tampines West",     lat:1.3454, lng:103.9383, lines:["DTL"] },
  { code:"DT30", name:"Tampines",          lat:1.3529, lng:103.9454, lines:["EWL","DTL"] },
  { code:"DT31", name:"Tampines East",     lat:1.3563, lng:103.9533, lines:["DTL"] },
  { code:"DT32", name:"Upper Changi",      lat:1.3413, lng:103.9614, lines:["DTL"] },
  { code:"DT33", name:"Expo",              lat:1.3353, lng:103.9614, lines:["DTL","CGL"] },
  { code:"DT35", name:"Xilin",             lat:1.3249, lng:103.9609, lines:["DTL"] },
  { code:"DT36", name:"Sungei Bedok",      lat:1.3179, lng:103.9607, lines:["DTL","TEL"] },
  // TEL
  { code:"TE1",  name:"Woodlands North",   lat:1.4481, lng:103.7983, lines:["TEL"] },
  { code:"TE2",  name:"Woodlands",         lat:1.4371, lng:103.7865, lines:["NSL","TEL"] },
  { code:"TE3",  name:"Woodlands South",   lat:1.4272, lng:103.7939, lines:["TEL"] },
  { code:"TE4",  name:"Springleaf",        lat:1.3981, lng:103.8187, lines:["TEL"] },
  { code:"TE5",  name:"Lentor",            lat:1.3846, lng:103.8368, lines:["TEL"] },
  { code:"TE6",  name:"Mayflower",         lat:1.3724, lng:103.8372, lines:["TEL"] },
  { code:"TE7",  name:"Bright Hill",       lat:1.3638, lng:103.8347, lines:["TEL"] },
  { code:"TE8",  name:"Upper Thomson",     lat:1.3542, lng:103.8329, lines:["TEL"] },
  { code:"TE9",  name:"Caldecott",         lat:1.3374, lng:103.8396, lines:["CCL","TEL"] },
  { code:"TE11", name:"Stevens",           lat:1.3201, lng:103.8260, lines:["DTL","TEL"] },
  { code:"TE12", name:"Napier",            lat:1.3066, lng:103.8187, lines:["TEL"] },
  { code:"TE13", name:"Orchard Blvd",      lat:1.3036, lng:103.8255, lines:["TEL"] },
  { code:"TE14", name:"Orchard",           lat:1.3040, lng:103.8318, lines:["NSL","TEL"] },
  { code:"TE15", name:"Great World",       lat:1.2944, lng:103.8355, lines:["TEL"] },
  { code:"TE16", name:"Havelock",          lat:1.2887, lng:103.8390, lines:["TEL"] },
  { code:"TE17", name:"Outram Park",       lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"TE18", name:"Maxwell",           lat:1.2791, lng:103.8448, lines:["TEL"] },
  { code:"TE19", name:"Shenton Way",       lat:1.2769, lng:103.8491, lines:["TEL"] },
  { code:"TE20", name:"Marina Bay",        lat:1.2764, lng:103.8546, lines:["NSL","CEL","TEL"] },
  { code:"TE22", name:"Gardens by the Bay",lat:1.2816, lng:103.8637, lines:["TEL"] },
  { code:"TE23", name:"Tanjong Rhu",       lat:1.2967, lng:103.8737, lines:["TEL"] },
  { code:"TE24", name:"Katong Park",       lat:1.3021, lng:103.8818, lines:["TEL"] },
  { code:"TE25", name:"Tanjong Katong",    lat:1.3046, lng:103.8925, lines:["TEL"] },
  { code:"TE26", name:"Marine Parade",     lat:1.3025, lng:103.9050, lines:["TEL"] },
  { code:"TE27", name:"Marine Terrace",    lat:1.3086, lng:103.9133, lines:["TEL"] },
  { code:"TE28", name:"Siglap",            lat:1.3125, lng:103.9267, lines:["TEL"] },
  { code:"TE29", name:"Bayshore",          lat:1.3184, lng:103.9373, lines:["TEL"] },
  { code:"TE30", name:"Bedok South",       lat:1.3204, lng:103.9468, lines:["TEL"] },
  { code:"TE31", name:"Sungei Bedok",      lat:1.3179, lng:103.9607, lines:["DTL","TEL"] },
];

const UNIQUE_STATIONS = STATIONS.reduce((acc, s) => {
  if (!acc.find(x => x.name === s.name)) acc.push(s);
  return acc;
}, []);

// Live coordinates from LTA DataMall — patches STATIONS on first load
(async () => {
  try {
    const KEY = "lta_stations_v2";
    let map = null;
    try { const c = sessionStorage.getItem(KEY); if (c) map = JSON.parse(c); } catch {}
    if (!map) {
      const r = await fetch("/api/stations");
      if (r.ok) { map = await r.json(); try { sessionStorage.setItem(KEY, JSON.stringify(map)); } catch {} }
    }
    if (map) STATIONS.forEach(s => { if (map[s.code]?.lat) { s.lat = map[s.code].lat; s.lng = map[s.code].lng; } });
  } catch {}
})();

// ─── LINE METADATA ───────────────────────────────────────────────────────────
const LINE_META = {
  NSL: { label:"North–South Line",          color:"#D42E12", short:"NSL" },
  EWL: { label:"East–West Line",            color:"#009645", short:"EWL" },
  NEL: { label:"North East Line",           color:"#9900AA", short:"NEL" },
  CCL: { label:"Circle Line",               color:"#FA9E0D", short:"CCL" },
  DTL: { label:"Downtown Line",             color:"#005EC4", short:"DTL" },
  TEL: { label:"Thomson–East Coast Line",   color:"#9D5918", short:"TEL" },
  BUS: { label:"Bus",                       color:"#F59E0B", short:"BUS" },
};

// ─── ROUTING ─────────────────────────────────────────────────────────────────
const LINE_SEQUENCES = {
  NSL: ["NS1","NS2","NS3","NS4","NS5","NS7","NS8","NS9","NS10","NS11","NS12","NS13","NS14","NS15","NS16","NS17","NS18","NS19","NS20","NS21","NS22","NS23","NS24","NS25","NS26","NS27","NS28"],
  EWL: ["EW33","EW32","EW31","EW30","EW29","EW28","EW27","EW26","EW25","EW24","EW23","EW22","EW21","EW20","EW19","EW18","EW17","EW16","EW15","EW14","EW13","EW12","EW11","EW10","EW9","EW8","EW7","EW6","EW5","EW4","EW3","EW2","EW1"],
  NEL: ["NE1","NE3","NE4","NE5","NE6","NE7","NE8","NE9","NE10","NE11","NE12","NE13","NE14","NE15","NE16","NE17"],
  CCL: ["CC1","CC2","CC3","CC4","CC5","CC6","CC7","CC8","CC9","CC10","CC11","CC12","CC13","CC14","CC15","CC16","CC17","CC19","CC20","CC21","CC22","CC23","CC24","CC25","CC26","CC27","CC28","CC29"],
  DTL: ["DT1","DT2","DT3","DT5","DT6","DT7","DT8","DT9","DT10","DT11","DT12","DT13","DT14","DT15","DT16","DT17","DT18","DT19","DT20","DT21","DT22","DT23","DT24","DT25","DT26","DT27","DT28","DT29","DT30","DT31","DT32","DT33","DT35","DT36"],
  TEL: ["TE1","TE2","TE3","TE4","TE5","TE6","TE7","TE8","TE9","TE11","TE12","TE13","TE14","TE15","TE16","TE17","TE18","TE19","TE20","TE22","TE23","TE24","TE25","TE26","TE27","TE28","TE29","TE30","TE31"],
};

function buildGraph() {
  const adj = {};
  STATIONS.forEach(s => { adj[s.code] = new Set(); });
  Object.values(LINE_SEQUENCES).forEach(seq => {
    for (let i = 0; i < seq.length - 1; i++) {
      const [a, b] = [seq[i], seq[i+1]];
      if (adj[a] && adj[b]) { adj[a].add(b); adj[b].add(a); }
    }
  });
  const byName = {};
  STATIONS.forEach(s => { (byName[s.name] = byName[s.name] || []).push(s.code); });
  Object.values(byName).forEach(codes => {
    if (codes.length < 2) return;
    codes.forEach(a => codes.forEach(b => { if (a !== b && adj[a] && adj[b]) { adj[a].add(b); adj[b].add(a); } }));
  });
  return adj;
}
const GRAPH = buildGraph();

function findPath(fromName, toName) {
  const fromCodes = STATIONS.filter(s => s.name === fromName).map(s => s.code);
  const toCodes = new Set(STATIONS.filter(s => s.name === toName).map(s => s.code));
  if (!fromCodes.length || !toCodes.size) return null;
  const visited = new Set(fromCodes);
  const queue = fromCodes.map(c => [c, [c]]);
  while (queue.length) {
    const [cur, path] = queue.shift();
    for (const nb of (GRAPH[cur] || [])) {
      if (!visited.has(nb)) {
        const newPath = [...path, nb];
        if (toCodes.has(nb)) return newPath;
        visited.add(nb);
        queue.push([nb, newPath]);
      }
    }
  }
  return null;
}

function findPathFewestTransfers(fromName, toName) {
  const fromCodes = STATIONS.filter(s => s.name === fromName).map(s => s.code);
  const toCodes = new Set(STATIONS.filter(s => s.name === toName).map(s => s.code));
  if (!fromCodes.length || !toCodes.size) return null;
  function getLine(code) {
    for (const [line, seq] of Object.entries(LINE_SEQUENCES)) if (seq.includes(code)) return line;
    return STATIONS.find(s => s.code === code)?.lines[0] || null;
  }
  const queue = fromCodes.map(c => ({ code:c, transfers:0, stops:0, path:[c], currentLine:getLine(c) }));
  const best = {};
  const key = (c,l) => `${c}|${l}`;
  queue.forEach(s => { best[key(s.code, s.currentLine)] = { transfers:0, stops:0 }; });
  while (queue.length) {
    queue.sort((a,b) => a.transfers - b.transfers || a.stops - b.stops);
    const cur = queue.shift();
    if (toCodes.has(cur.code)) return cur.path;
    for (const nb of (GRAPH[cur.code] || [])) {
      const nbLine = getLine(nb);
      const nbSt = STATIONS.find(s => s.code === nb);
      const curSt = STATIONS.find(s => s.code === cur.code);
      const isInterchange = curSt && nbSt && curSt.name === nbSt.name;
      const newTransfers = cur.transfers + (isInterchange ? 1 : 0);
      const newStops = cur.stops + 1;
      const k = key(nb, nbLine);
      if (!best[k] || newTransfers < best[k].transfers || (newTransfers === best[k].transfers && newStops < best[k].stops)) {
        best[k] = { transfers:newTransfers, stops:newStops };
        queue.push({ code:nb, transfers:newTransfers, stops:newStops, path:[...cur.path,nb], currentLine:nbLine });
      }
    }
  }
  return null;
}

function pathToLegs(codePath) {
  if (!codePath || codePath.length < 2) return [];
  function sharedLine(a, b) {
    const sa = STATIONS.find(s => s.code === a);
    const sb = STATIONS.find(s => s.code === b);
    if (!sa || !sb) return null;
    if (sa.name === sb.name) return null;
    return sa.lines.find(l => sb.lines.includes(l)) || null;
  }
  const legs = [];
  let legLine = sharedLine(codePath[0], codePath[1]);
  if (!legLine) legLine = STATIONS.find(s => s.code === codePath[0])?.lines[0] || null;
  let legCodes = [codePath[0]];
  for (let i = 1; i < codePath.length; i++) {
    const cur = codePath[i];
    const nextLine = i < codePath.length - 1 ? sharedLine(cur, codePath[i+1]) : null;
    const curSt = STATIONS.find(s => s.code === cur);
    const prevSt = STATIONS.find(s => s.code === codePath[i-1]);
    const isInterchange = curSt && prevSt && curSt.name === prevSt.name;
    if (isInterchange) {
      const stops = legCodes.map(c => { const s = STATIONS.find(st => st.code === c); return s ? {...s} : {name:c, code:c, lat:0, lng:0}; });
      if (stops.length > 0) legs.push({ line:legLine, stops });
      legLine = nextLine || curSt?.lines.find(l => l !== prevSt?.lines[0]) || curSt?.lines[0];
      legCodes = [cur];
    } else {
      legCodes.push(cur);
      const lineChange = nextLine && nextLine !== legLine;
      if (lineChange || i === codePath.length - 1) {
        const stops = legCodes.map(c => { const s = STATIONS.find(st => st.code === c); return s ? {...s} : {name:c, code:c, lat:0, lng:0}; });
        legs.push({ line:legLine, stops });
        if (lineChange) { legLine = nextLine; legCodes = [cur]; }
      }
    }
  }
  return legs.filter(leg => leg.stops.length >= 1);
}

function buildAlerts(legs) {
  const alerts = [];
  legs.forEach((leg, i) => {
    const isLast = i === legs.length - 1;
    const lastStop = leg.stops[leg.stops.length - 1];
    if (!isLast) {
      alerts.push({ id:`transfer-${lastStop.code}`, type:"transfer", stopCode:lastStop.code, stopName:lastStop.name, radiusM:600, message:"Get ready to transfer", detail:`Board ${LINE_META[legs[i+1].line]?.label || legs[i+1].line} at ${lastStop.name}`, color:"#F59E0B", vibratePattern:[200,100,200], lat:lastStop.lat, lng:lastStop.lng });
    } else {
      alerts.push({ id:`alight-${lastStop.code}`, type:"alight", stopCode:lastStop.code, stopName:lastStop.name, radiusM:400, message:"Alight now!", detail:`${lastStop.name}`, color:"#009645", vibratePattern:[300,100,300,100,600], lat:lastStop.lat, lng:lastStop.lng });
    }
  });
  return alerts;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestStation(lat, lng) {
  return UNIQUE_STATIONS.reduce((best, s) => {
    const d = haversineM(lat, lng, s.lat, s.lng);
    return d < best.d ? { s, d } : best;
  }, { s:null, d:Infinity }).s;
}

function vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

async function geocodePostal(postal) {
  const res = await fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
  if (!res.ok) throw new Error("Postal code not found");
  const data = await res.json();
  if (!data.results?.length) throw new Error("Postal code not found");
  const r = data.results[0];
  return { lat:parseFloat(r.LATITUDE), lng:parseFloat(r.LONGITUDE), address:r.ADDRESS };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function LinePill({ line, small }) {
  const m = LINE_META[line] || { color:"#666", short:line };
  return <span style={{ background:m.color, color:"#fff", fontWeight:800, fontSize:small?10:11, borderRadius:5, padding:small?"1px 6px":"2px 8px", flexShrink:0, letterSpacing:"0.03em" }}>{m.short}</span>;
}

function StopDot({ color, passed, active, isAlert }) {
  const size = isAlert ? 13 : 9;
  return <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, background:passed||active?color:"transparent", border:`2px solid ${isAlert?color:passed?color:"#1E2D40"}`, boxShadow:active?`0 0 10px ${color}`:"none", transition:"all .3s" }} />;
}

function StopRow({ stop, color, isFirst, isLast, isTransferAlert, isAlightAlert, passed, active }) {
  return (
    <div style={{ display:"flex", alignItems:"stretch", minHeight:(isTransferAlert||isAlightAlert)?42:32 }}>
      <div style={{ width:26, display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
        <div style={{ width:2, flex:isFirst?0:1, background:color, opacity:passed?1:0.18 }} />
        <StopDot color={color} passed={passed} active={active} isAlert={isTransferAlert||isAlightAlert} />
        <div style={{ width:2, flex:isLast?0:1, background:color, opacity:passed?1:0.18 }} />
      </div>
      <div style={{ paddingLeft:9, display:"flex", flexDirection:"column", justifyContent:"center", paddingBottom:2 }}>
        <span style={{ color:isAlightAlert?"#fff":isTransferAlert?"#FCD34D":passed?"#2D3748":"#4B5563", fontSize:(isTransferAlert||isAlightAlert)?13:12, fontWeight:(isTransferAlert||isAlightAlert)?700:400, textDecoration:passed&&!isTransferAlert&&!isAlightAlert?"line-through":"none", transition:"color .3s" }}>
          {stop.name}
        </span>
        {isTransferAlert && <span style={{ color:"#92400E", fontSize:10, fontWeight:600 }}>⇄ transfer here</span>}
        {isAlightAlert && <span style={{ color:"#059669", fontSize:10, fontWeight:600 }}>↓ alight here</span>}
      </div>
    </div>
  );
}

function AlertBanner({ alert, onMissed, onTransferred }) {
  return (
    <div style={{ background:alert.type==="alight"?"#052e16":"#1c1400", border:`1.5px solid ${alert.color}`, borderRadius:14, padding:"14px 14px", animation:"pulse2 .9s ease infinite" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
        <div>
          <div style={{ color:alert.color, fontSize:15, fontWeight:800, marginBottom:2 }}>{alert.type==="alight"?"🔔":"⇄"} {alert.message}</div>
          <div style={{ color:"#6B7280", fontSize:12 }}>{alert.detail}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
          {alert.type==="transfer" && (
            <button onClick={onTransferred} style={{ background:"#14532d", border:"1px solid #16a34a", color:"#4ade80", fontSize:10, fontWeight:700, borderRadius:8, padding:"6px 10px", cursor:"pointer", lineHeight:1.3, textAlign:"center" }}>
              Transferred ✓
            </button>
          )}
          <button onClick={onMissed} style={{ background:"#1E2D40", border:"none", color:"#94A3B8", fontSize:10, fontWeight:700, borderRadius:8, padding:"6px 10px", cursor:"pointer", lineHeight:1.3, textAlign:"center" }}>
            I missed<br />my stop
          </button>
        </div>
      </div>
    </div>
  );
}

function MissedPanel({ alerts, firedCount, onDismiss }) {
  const lastFired = alerts[firedCount-1];
  const isTransfer = lastFired?.type === "transfer";
  return (
    <div style={{ background:"#1a0a00", border:"1.5px solid #DC2626", borderRadius:14, padding:14 }}>
      <div style={{ color:"#EF4444", fontSize:14, fontWeight:800, marginBottom:6 }}>😬 Missed {isTransfer?"the transfer":"your stop"}</div>
      {isTransfer ? (
        <div style={{ color:"#9CA3AF", fontSize:12, lineHeight:1.6, marginBottom:10 }}>
          Stay on. Take the next train back to <b style={{ color:"#fff" }}>{lastFired?.stopName}</b> and board the connecting line.
        </div>
      ) : (
        <div style={{ color:"#9CA3AF", fontSize:12, lineHeight:1.6, marginBottom:10 }}>
          Ride one more stop, alight, and take the next train back to <b style={{ color:"#fff" }}>{lastFired?.stopName}</b>.
        </div>
      )}
      <button onClick={onDismiss} style={{ width:"100%", padding:"9px", borderRadius:9, border:"1px solid #374151", background:"transparent", color:"#94A3B8", fontSize:13, fontWeight:600, cursor:"pointer" }}>
        Got it — keep tracking
      </button>
    </div>
  );
}

function PostalInput({ label, value, onChange, status, station, extra }) {
  const color = status==="ok"?"#009645":status==="error"?"#DC2626":status==="loading"?"#F59E0B":"#1E2D40";
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ background:"#161B27", borderRadius:14, border:`1.5px solid ${color}`, transition:"border-color .2s", padding:"14px 16px", display:"flex", alignItems:"center", gap:10, cursor:"text" }}
        onClick={e => e.currentTarget.querySelector("input").focus()}>
        <span style={{ fontSize:16 }}>{status==="ok"?"✅":status==="loading"?"⏳":status==="error"?"❌":"📍"}</span>
        <input
          type="tel" inputMode="numeric" maxLength={6} placeholder="e.g. 759775"
          value={value} onChange={e => onChange(e.target.value.replace(/\D/g,"").slice(0,6))}
          style={{ flex:1, background:"transparent", border:"none", color:value?"#fff":"#374151", fontSize:15, fontWeight:value?700:400, padding:0, fontFamily:"'DM Sans', -apple-system, sans-serif", letterSpacing:"normal", outline:"none" }}
        />
        {extra && <div onClick={e => e.stopPropagation()}>{extra}</div>}
      </div>
      {station && <div style={{ color:"#009645", fontSize:12, marginTop:5, paddingLeft:4 }}>→ Nearest: <b>{station.name}</b></div>}
      {status==="error" && <div style={{ color:"#DC2626", fontSize:12, marginTop:5, paddingLeft:4 }}>Postal code not found</div>}
    </div>
  );
}

const LINE_ORDER = ["NSL","EWL","NEL","CCL","DTL","TEL"];

function StationPicker({ label, value, onChange, extra }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const showSuggestions = focused && query.length > 0;
  const filtered = showSuggestions ? UNIQUE_STATIONS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6) : [];

  function select(st) {
    onChange(st);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  }

  function handleBlur(e) {
    // Delay so tap on suggestion registers before blur hides it
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) setFocused(false);
    }, 150);
  }

  return (
    <div ref={containerRef} style={{ marginBottom:12 }}>
      <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ background:"#161B27", borderRadius:showSuggestions?`14px 14px 0 0`:14, border:`1.5px solid ${value?"#009645":focused?"#60A5FA":"#1E2D40"}`, padding:"14px 16px", display:"flex", alignItems:"center", gap:10, transition:"border-color .2s", boxSizing:"border-box" }}>
        <span style={{ fontSize:16 }}>{value?"✅":"🚉"}</span>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
          <input
            ref={inputRef}
            placeholder={value && !query ? value.name : "Type a station name…"}
            value={query}
            onChange={e => { setQuery(e.target.value); if (value) onChange(null); }}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            style={{ background:"transparent", border:"none", color:"#fff", fontSize:15, fontWeight:value&&!query?700:400, padding:0, fontFamily:"inherit", outline:"none", width:"100%" }}
          />
          {value && !query && <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{value.lines.filter(l => LINE_META[l]).map(l => <LinePill key={l} line={l} small />)}</div>}
        </div>
        {query && <button onMouseDown={e => e.preventDefault()} onClick={() => { setQuery(""); onChange(null); inputRef.current?.focus(); }} style={{ background:"none", border:"none", color:"#374151", cursor:"pointer", fontSize:14, padding:0, flexShrink:0 }}>✕</button>}
        {extra && <div>{extra}</div>}
      </div>
      {showSuggestions && (
        <div style={{ background:"#161B27", border:"1.5px solid #60A5FA", borderTop:"none", borderRadius:"0 0 14px 14px", overflow:"hidden" }}>
          {filtered.length === 0 && <div style={{ color:"#374151", fontSize:13, padding:"12px 16px" }}>No stations found</div>}
          {filtered.map(st => (
            <div key={st.code} onMouseDown={e => e.preventDefault()} onClick={() => select(st)}
              style={{ padding:"10px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderTop:"1px solid #0D1117" }}>
              <div style={{ flex:1 }}>
                <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{st.name}</span>
              </div>
              <div style={{ display:"flex", gap:3 }}>{st.lines.filter(l => LINE_META[l]).map(l => <LinePill key={l} line={l} small />)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEAR ME BUTTON ──────────────────────────────────────────────────────────
function NearMeButton({ onFound, style }) {
  return (
    <button onClick={() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(pos => {
        onFound({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, null, { enableHighAccuracy: true, timeout: 8000 });
    }} style={{ background:"#1E2D40", border:"1px solid #2D3F55", borderRadius:8, color:"#60A5FA", fontSize:11, fontWeight:700, padding:"0 8px", height:24, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap", lineHeight:"24px", ...style }}>
      📍 Near me
    </button>
  );
}

// ─── BUS COMPONENTS ──────────────────────────────────────────────────────────
function BusStopField({ label, value, onChange, status, name, extra }) {
  const borderColor = status==="ok"?"#16a34a":status==="error"?"#EF4444":"#1E2D40";
  const icon = status==="ok"?"✅":status==="error"?"❌":status==="loading"?"⏳":"🚏";
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ background:"#161B27", borderRadius:14, border:`1.5px solid ${borderColor}`, transition:"border-color .2s", padding:"14px 16px", display:"flex", alignItems:"center", gap:10, cursor:"text" }}
        onClick={e => e.currentTarget.querySelector("input").focus()}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <input
          type="tel" inputMode="numeric" maxLength={6}
          placeholder="Bus stop code or postal code"
          value={value} onChange={e => onChange(e.target.value.replace(/\D/g,"").slice(0,6))}
          style={{ flex:1, background:"transparent", border:"none", color:value?"#fff":"#374151", fontSize:15, fontWeight:value?700:400, padding:0, fontFamily:"'DM Sans', -apple-system, sans-serif", letterSpacing:"normal", outline:"none" }}
        />
        {extra && <div onClick={e => e.stopPropagation()}>{extra}</div>}
      </div>
      {status==="ok" && name && <div style={{ color:"#4ade80", fontSize:12, marginTop:4, paddingLeft:4 }}>{name}</div>}
      {status==="error" && <div style={{ color:"#EF4444", fontSize:12, marginTop:4, paddingLeft:4 }}>Stop not found</div>}
    </div>
  );
}

function BusInputPanel({ onTrack }) {
  const [stopMap, setStopMap] = useState(null);
  const [loadingStops, setLoadingStops] = useState(false);
  const [from, setFrom] = useState({ value:"", coord:null, name:"", status:"idle", picked:false });
  const [to,   setTo]   = useState({ value:"", coord:null, name:"", status:"idle", picked:false });
  const [fromNearby, setFromNearby] = useState([]);
  const [toNearby,   setToNearby]   = useState([]);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null); // { route, boardStop, alightStop, nearbyBoard, nearbyAlight }
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Bus stops are embedded statically — no API call needed
  useEffect(() => {
    if (Object.keys(BUS_STOPS).length > 0) {
      setStopMap(BUS_STOPS);
    }
    setLoadingStops(false);
  }, []);

  function resolveInput(val, stopMap, side, setter, setNearby) {
    const clean = val.replace(/\D/g,"").slice(0,6);
    const update = { value:clean, coord:null, name:"", status:"idle", picked:false };

    if (clean.length === 5 && stopMap) {
      const s = stopMap[clean];
      if (s) { update.coord = { lat:s[0], lng:s[1] }; update.name = s[2]; update.status = "ok"; update.picked = true; }
      else { update.status = "error"; }
      setter(update);
      setNearby([]);
    } else if (clean.length === 6) {
      update.status = "loading";
      setter(update);
      setNearby([]);
      geocodePostal(clean)
        .then(r => {
          // Find nearest stops to the geocoded location
          const nearby = Object.entries(BUS_STOPS)
            .map(([code, v]) => ({ code, lat:v[0], lng:v[1], name:v[2], d:haversineM(r.lat, r.lng, v[0], v[1]) }))
            .filter(s => s.d <= 600)
            .sort((a, b) => a.d - b.d)
            .slice(0, 3);
          setNearby(nearby);
          // Auto-pick nearest but mark as not confirmed
          const nearest = nearby[0];
          setter(prev => ({
            ...prev,
            coord: nearest ? { lat:nearest.lat, lng:nearest.lng } : { lat:r.lat, lng:r.lng },
            name: nearest ? nearest.name : r.address,
            status: "ok",
            picked: false, // user should confirm
          }));
        })
        .catch(() => setter(prev => ({ ...prev, status:"error" })));
    } else {
      setter(update);
      setNearby([]);
    }
  }

  function findRoutes() {
    if (!from.coord || !to.coord) return;
    setLoading(true); setRoutes(null); setConfirm(null); setSelectedIdx(null);

    setTimeout(() => {
      try {
        const BUS_MIN = 3;
        const NEARBY_M = 800; // Find stops within an 800m bubble

        // Always search all nearby stops regardless of input method
        const getStopCodes = (field) => {
          const lat = field.coord.lat, lng = field.coord.lng;
          const nearby = Object.entries(BUS_STOPS)
            .map(([code, v]) => ({ code, d: haversineM(lat, lng, v[0], v[1]) }))
            .filter(s => s.d <= NEARBY_M)
            .sort((a, b) => a.d - b.d)
            .slice(0, 10)
            .map(s => s.code);
          if (field.value.length === 5 && BUS_STOPS[field.value] && !nearby.includes(field.value)) {
            nearby.push(field.value);
          }
          return nearby;
        };

        const originCodes = new Set(getStopCodes(from));
        const destCodes   = new Set(getStopCodes(to));

        if (!originCodes.size || !destCodes.size) {
          setRoutes({ list:[], nearbyBoard:[], nearbyAlight:[] });
          setLoading(false);
          return;
        }

        const found = [];
        const dLat = to.coord.lat, dLng = to.coord.lng;
        const oLat = from.coord.lat, oLng = from.coord.lng;

        for (const [key, stops] of Object.entries(BUS_ROUTES)) {
          const [serviceNo] = key.split("_");
          let oIdx = -1;
          const candidateDest = []; 

          for (let i = 0; i < stops.length; i++) {
            if (originCodes.has(stops[i]) && oIdx === -1) oIdx = i;
            if (oIdx !== -1 && i > oIdx && destCodes.has(stops[i])) {
              const sv = BUS_STOPS[stops[i]];
              if (sv) candidateDest.push({ i, code:stops[i], lat:sv[0], lng:sv[1], name:sv[2], distToTarget: haversineM(dLat, dLng, sv[0], sv[1]) });
            }
          }
          if (oIdx === -1 || !candidateDest.length) continue;

          const fv = BUS_STOPS[stops[oIdx]];
          if (!fv) continue;
          const distFromOrigin = haversineM(oLat, oLng, fv[0], fv[1]);

          // Score every candidate stop for this specific bus route based on Bus Time + Walking Time
          const scoredCandidates = candidateDest.map(c => {
            const stopCount = c.i - oIdx;
            const busMins = stopCount * BUS_MIN;
            const walkAlightMins = c.distToTarget / 80; // 80 meters per minute walking speed
            const walkBoardMins = distFromOrigin / 80;
            return {
              candidate: c,
              stopCount,
              totalMins: walkBoardMins + busMins + walkAlightMins
            };
          });

          // Pick the single best alighting stop for this route that minimizes total effort
          const bestOption = scoredCandidates.sort((a, b) => a.totalMins - b.totalMins)[0];
          const best = bestOption.candidate;
          const stopCount = bestOption.stopCount;

          const legStops = stops.slice(oIdx, best.i + 1).map(c => {
            const sv = BUS_STOPS[c];
            return sv ? { code:c, lat:sv[0], lng:sv[1], name:sv[2] } : { code:c, lat:0, lng:0, name:c };
          });

          found.push({
            serviceNo,
            from: { code:stops[oIdx], lat:fv[0], lng:fv[1], name:fv[2] },
            to:   { code:best.code, lat:best.lat, lng:best.lng, name:best.name },
            stops: legStops, 
            stopCount, 
            estMins: stopCount * BUS_MIN,
            totalMins: bestOption.totalMins // Save total journey time for global sorting
          });
        }

        // Deduplicate and sort globally by true journey time (riding + walking)
        const seenKey = new Set();
        const dedupedRoutes = [];
        for (const r of found.sort((a, b) => a.totalMins - b.totalMins)) {
          const key = r.serviceNo + "|" + r.from.code + "|" + r.to.code;
          if (!seenKey.has(key)) { seenKey.add(key); dedupedRoutes.push(r); }
        }

        // Nearby stops for the swap UI on confirm screen
        const nearbyBoard  = Object.entries(BUS_STOPS)
          .map(([code, v]) => ({ code, lat:v[0], lng:v[1], name:v[2], d:haversineM(from.coord.lat, from.coord.lng, v[0], v[1]) }))
          .filter(s => s.d <= 400).sort((a,b) => a.d - b.d).slice(0, 3);
        const nearbyAlight = Object.entries(BUS_STOPS)
          .map(([code, v]) => ({ code, lat:v[0], lng:v[1], name:v[2], d:haversineM(to.coord.lat, to.coord.lng, v[0], v[1]) }))
          .filter(s => s.d <= 400).sort((a,b) => a.d - b.d).slice(0, 3);

        setRoutes({ list: dedupedRoutes.slice(0, 8), nearbyBoard, nearbyAlight });
      } catch(e) {
        console.error(e);
        setRoutes({ list:[], nearbyBoard:[], nearbyAlight:[] });
      }
      setLoading(false);
    }, 50);
  }

  // ── Confirm screen
  if (confirm) {
    const { route, boardStop, alightStop, nearbyBoard, nearbyAlight } = confirm;
    return (
      <div>
        <button onClick={() => setConfirm(null)} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", padding:0, marginBottom:16 }}>← Back</button>
        <div style={{ color:"#fff", fontSize:18, fontWeight:800, marginBottom:16 }}>🚌 Bus {route.serviceNo}</div>

        <div style={{ marginBottom:16 }}>
          <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>Board at</div>
          <div style={{ background:"#0D1117", border:"1.5px solid #16a34a", borderRadius:12, padding:"10px 14px", marginBottom:8 }}>
            <div style={{ color:"#4ade80", fontSize:14, fontWeight:700 }}>{boardStop.code} · {boardStop.name}</div>
          </div>
          {nearbyBoard.filter(s => s.code !== boardStop.code).length > 0 && (
            <>
              <div style={{ color:"#374151", fontSize:11, marginBottom:6 }}>Or a nearby stop:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {nearbyBoard.filter(s => s.code !== boardStop.code).slice(0,5).map(s => (
                  <button key={s.code} onClick={() => setConfirm(prev => ({ ...prev, boardStop:s }))}
                    style={{ background:"#161B27", border:"1px solid #1E2D40", borderRadius:8, padding:"5px 10px", color:"#6B7280", fontSize:11, cursor:"pointer" }}>
                    {s.code} · {s.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>Alight at</div>
          <div style={{ background:"#0D1117", border:"1.5px solid #D42E12", borderRadius:12, padding:"10px 14px", marginBottom:8 }}>
            <div style={{ color:"#f87171", fontSize:14, fontWeight:700 }}>{alightStop.code} · {alightStop.name}</div>
          </div>
          {nearbyAlight.filter(s => s.code !== alightStop.code).length > 0 && (
            <>
              <div style={{ color:"#374151", fontSize:11, marginBottom:6 }}>Or a nearby stop:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {nearbyAlight.filter(s => s.code !== alightStop.code).slice(0,5).map(s => (
                  <button key={s.code} onClick={() => setConfirm(prev => ({ ...prev, alightStop:s }))}
                    style={{ background:"#161B27", border:"1px solid #1E2D40", borderRadius:8, padding:"5px 10px", color:"#6B7280", fontSize:11, cursor:"pointer" }}>
                    {s.code} · {s.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => {
            const stops = route.stops;
            const bi = stops.findIndex(s => s.code === boardStop.code);
            const ai = stops.findIndex(s => s.code === alightStop.code);
            const legStops = bi >= 0 && ai > bi ? stops.slice(bi, ai+1) : stops;
            onTrack({
              legs: [{ line:"BUS", stops:legStops, serviceNo:route.serviceNo }],
              alerts: [{ id:"alight-bus", type:"alight", stopCode:alightStop.code, stopName:alightStop.name, radiusM:400, message:"Alight now!", detail:`${alightStop.name} (${alightStop.code})`, color:"#009645", vibratePattern:[300,100,300,100,600], lat:alightStop.lat, lng:alightStop.lng }],
              stopCount: legStops.length-1, transfers:0, mode:"fewest", isBus:true, serviceNo:route.serviceNo,
              fromName: `Stop ${boardStop.code}`, toName: alightStop.name,
            });
          }}
          style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"#D42E12", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 8px 24px rgba(212,46,18,.3)" }}
        >
          Track Bus {route.serviceNo} →
        </button>
      </div>
    );
  }

  // ── Route list
  const canSearch = from.status==="ok" && to.status==="ok";
  return (
    <>
      {loadingStops && <div style={{ color:"#F59E0B", fontSize:12, marginBottom:10 }}>⏳ Loading stop data…</div>}
      <BusStopField label="From" value={from.value} onChange={v => resolveInput(v, stopMap, "from", setFrom, setFromNearby)} status={from.status} name={from.name}
        extra={<NearMeButton onFound={pos => {
          const nearby = Object.entries(BUS_STOPS)
            .map(([code, v]) => ({ code, lat:v[0], lng:v[1], name:v[2], d:haversineM(pos.lat, pos.lng, v[0], v[1]) }))
            .filter(s => s.d <= 400).sort((a,b) => a.d - b.d).slice(0, 3);
          setFromNearby(nearby);
          if (nearby[0]) setFrom(prev => ({ ...prev, value:nearby[0].code, coord:{ lat:nearby[0].lat, lng:nearby[0].lng }, name:nearby[0].name, status:"ok", picked:false }));
        }} />} />

      <BusStopField label="To"   value={to.value}   onChange={v => resolveInput(v, stopMap, "to",   setTo,   setToNearby)}   status={to.status}   name={to.name}   />


      <button disabled={!canSearch||loading} onClick={findRoutes}
        style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:canSearch&&!loading?"#2563EB":"#1E2D40", color:canSearch&&!loading?"#fff":"#374151", fontSize:14, fontWeight:800, cursor:canSearch&&!loading?"pointer":"not-allowed" }}>
        {loading ? "Finding routes…" : "Find Bus Routes"}
      </button>

      {routes && routes.list.length === 0 && (
        <div style={{ color:"#EF4444", fontSize:12, marginTop:10, paddingLeft:4 }}>No direct bus routes found. Try different stops.</div>
      )}
      {routes && routes.list.length > 0 && (
        <div style={{ marginTop:16 }}>
          <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>Routes found</div>
          {routes.list.map((r, i) => {
            // Warn if another result for same service is much shorter (wrong direction)
            const sameService = routes.list.filter((x, j) => j !== i && x.serviceNo === r.serviceNo);
            const hasShorter = sameService.some(x => x.stopCount < r.stopCount - 3);
            return (
              <button key={i} onClick={() => { setSelectedIdx(i); setConfirm({ route:r, boardStop:r.from, alightStop:r.to, nearbyBoard:routes.nearbyBoard, nearbyAlight:routes.nearbyAlight }); }}
                style={{ width:"100%", marginBottom:8, padding:"12px 14px", borderRadius:12, border:`1px solid ${selectedIdx===i?"#2563EB":hasShorter?"#78350f":"#1E2D40"}`, background:selectedIdx===i?"#0a1628":"#0D1117", cursor:"pointer", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"#fff", fontSize:16, fontWeight:800 }}>Bus {r.serviceNo}</span>
                  <span style={{ color:hasShorter?"#F59E0B":"#6B7280", fontSize:11 }}>{r.stopCount} stops · ~{r.estMins} min</span>
                </div>
                <div style={{ color:"#4B5563", fontSize:11, marginTop:3 }}>{r.from.name} → {r.to.name}</div>
                {hasShorter && <div style={{ color:"#F59E0B", fontSize:10, marginTop:4 }}>⚠️ Long route — check the shorter option below</div>}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}


// ─── MIXED ROUTING ───────────────────────────────────────────────────────────
function computeMixedRoutes(oLat, oLng, dLat, dLng) {
  const STATION_RADIUS = 800;   // max walk to MRT station
  const BUS_STOP_RADIUS = 400;  // max walk to bus stop
  const MRT_MIN = 2;            // mins per MRT stop
  const BUS_MIN = 3;            // mins per bus stop
  const TRANSFER_PENALTY = 5;   // mins per transfer
  const MAX_TRANSFERS = 3;

  // Helper: Find MRT stations near a coordinate
  function nearbyStations(lat, lng) {
    return UNIQUE_STATIONS
      .map(s => ({ ...s, d: haversineM(lat, lng, s.lat, s.lng) }))
      .filter(s => s.d <= STATION_RADIUS)
      .sort((a, b) => a.d - b.d);
  }

  // Helper: Find bus stops near a coordinate
  function nearbyBusStops(lat, lng) {
    return Object.entries(BUS_STOPS)
      .map(([code, v]) => ({ code, lat: v[0], lng: v[1], name: v[2], d: haversineM(lat, lng, v[0], v[1]) }))
      .filter(s => s.d <= BUS_STOP_RADIUS)
      .sort((a, b) => a.d - b.d);
  }

  // Pre-calculate endpoint options
  const startStations = nearbyStations(oLat, oLng);
  const startBusStops = nearbyBusStops(oLat, oLng);
  const endStations   = nearbyStations(dLat, dLng);
  const endBusStops   = nearbyBusStops(dLat, dLng);

  // Map to speed up looking up what routes pass through a bus stop code
  const stopToRoutesMap = {};
  for (const [routeKey, stops] of Object.entries(BUS_ROUTES)) {
    stops.forEach((stopCode, idx) => {
      if (!stopToRoutesMap[stopCode]) stopToRoutesMap[stopCode] = [];
      stopToRoutesMap[stopCode].push({ routeKey, idx, stops });
    });
  }

  const routes = [];

  // Queue state shape: { type, currentCode, currentName, lat, lng, estMins, transfers, legs, alerts }
  const queue = [];

  // Seed Initial Options: Walk to nearby Bus Stops
  startBusStops.forEach(bs => {
    const walkMins = bs.d / 80; // Assuming ~80m per minute walking speed
    queue.push({
      type: "bus",
      currentCode: bs.code,
      currentName: bs.name,
      lat: bs.lat,
      lng: bs.lng,
      estMins: walkMins,
      transfers: 0,
      legs: [],
      alerts: []
    });
  });

  // Seed Initial Options: Walk to nearby MRT Stations
  startStations.forEach(st => {
    const walkMins = st.d / 80;
    queue.push({
      type: "mrt",
      currentCode: st.name, // MRT nodes tracked by station name matching existing codebase
      currentName: st.name,
      lat: st.lat,
      lng: st.lng,
      estMins: walkMins,
      transfers: 0,
      legs: [],
      alerts: []
    });
  });

  // Process multi-modal transitions via custom bounded path discovery
  while (queue.length > 0) {
    const curr = queue.shift();

    if (curr.transfers > MAX_TRANSFERS) continue;
    if (curr.estMins > 120) continue; // Prune excessive journeys

    // Check destination arrivals from current point
    if (curr.type === "bus") {
      const destMatch = endBusStops.find(d => d.code === curr.currentCode);
      if (destMatch) {
        const finalWalkMins = destMatch.d / 80;
        routes.push({
          type: "mixed",
          transfers: curr.transfers,
          estMins: curr.estMins + finalWalkMins,
          label: curr.legs.map(l => l.line === "BUS" ? `Bus ${l.serviceNo}` : "MRT").join(" → "),
          legs: curr.legs,
          alerts: curr.alerts,
          stopCount: curr.legs.reduce((sum, l) => sum + l.stops.length - 1, 0),
          fromName: curr.legs[0]?.stops[0]?.name || curr.currentName,
          toName: curr.currentName
        });
      }
    } else if (curr.type === "mrt") {
      const destMatch = endStations.find(d => d.name === curr.currentCode);
      if (destMatch) {
        const finalWalkMins = destMatch.d / 80;
        routes.push({
          type: "mixed",
          transfers: curr.transfers,
          estMins: curr.estMins + finalWalkMins,
          label: curr.legs.map(l => l.line === "BUS" ? `Bus ${l.serviceNo}` : "MRT").join(" → "),
          legs: curr.legs,
          alerts: curr.alerts,
          stopCount: curr.legs.reduce((sum, l) => sum + l.stops.length - 1, 0),
          fromName: curr.legs[0]?.stops[0]?.name || curr.currentName,
          toName: curr.currentName
        });
      }
    }

    // EXPANSION STEP 1: If current state is at a Bus Stop, ride a bus or transfer to an MRT station
    if (curr.type === "bus") {
      const matchingRoutes = stopToRoutesMap[curr.currentCode] || [];
      matchingRoutes.forEach(({ routeKey, idx, stops }) => {
        const [serviceNo] = routeKey.split("_");
        
        // Don't repeatedly board the same bus service back-to-back
        if (curr.legs.length > 0 && curr.legs[curr.legs.length - 1].serviceNo === serviceNo) return;

        // Explore downstream options along this service timeline
        for (let i = idx + 1; i < stops.length; i++) {
          const downstreamCode = stops[i];
          const stopDetails = BUS_STOPS[downstreamCode];
          if (!stopDetails) continue;

          const stopsPassed = i - idx;
          const travelMins = stopsPassed * BUS_MIN;
          const transferCost = curr.legs.length > 0 ? TRANSFER_PENALTY : 0;
          const addedTransfers = curr.legs.length > 0 ? 1 : 0;

          if (curr.transfers + addedTransfers > MAX_TRANSFERS) continue;

          const legStops = stops.slice(idx, i + 1).map(c => {
            const sv = BUS_STOPS[c];
            return sv ? { code: c, lat: sv[0], lng: sv[1], name: sv[2] } : { code: c, lat: 0, lng: 0, name: c };
          });

          const newLeg = { line: "BUS", stops: legStops, serviceNo };
          const newAlert = {
            id: `alight-bus-${serviceNo}-${downstreamCode}-${Date.now()}`,
            type: "alight",
            stopCode: downstreamCode,
            stopName: stopDetails[2],
            radiusM: 400,
            message: "Alight now!",
            detail: `${stopDetails[2]} (${downstreamCode})`,
            color: "#009645",
            vibratePattern: [300, 100, 300, 100, 600],
            lat: stopDetails[0],
            lng: stopDetails[1]
          };

          queue.push({
            type: "bus",
            currentCode: downstreamCode,
            currentName: stopDetails[2],
            lat: stopDetails[0],
            lng: stopDetails[1],
            estMins: curr.estMins + travelMins + transferCost,
            transfers: curr.transfers + addedTransfers,
            legs: [...curr.legs, newLeg],
            alerts: [...curr.alerts, newAlert]
          });
        }
      });

      // Transfer Option: Walk from this bus stop to a nearby MRT Station
      const adjacentStations = nearbyStations(curr.lat, curr.lng);
      adjacentStations.forEach(st => {
        // Prevent walking back to a mode if we just came from it
        if (curr.legs.length > 0 && curr.legs[curr.legs.length - 1].line !== "BUS") return;

        const walkTime = st.d / 80;
        queue.push({
          type: "mrt",
          currentCode: st.name,
          currentName: st.name,
          lat: st.lat,
          lng: st.lng,
          estMins: curr.estMins + walkTime,
          transfers: curr.transfers, // Mode transfer state change context handled on boarding expansion
          legs: curr.legs,
          alerts: curr.alerts
        });
      });
    }

    // EXPANSION STEP 2: If current state is at an MRT Station, ride MRT lines or transfer to a Bus Stop
    if (curr.type === "mrt") {
      // Explore traveling to any other MRT station using your precalculated paths or graph system
      UNIQUE_STATIONS.forEach(targetStation => {
        if (targetStation.name === curr.currentCode) return;

        // Fetch valid path through graph architecture
        const path = findPathFewestTransfers(curr.currentCode, targetStation.name) || findPath(curr.currentCode, targetStation.name);
        if (!path || !path.length) return;

        const intermediateLegs = pathToLegs(path);
        if (!intermediateLegs.length) return;

        const uniqueNames = [...new Set(path.map(c => STATIONS.find(s => s.code === c)?.name))];
        const stopCount = uniqueNames.length - 1;
        const lineTransfers = intermediateLegs.length - 1;
        const addedTransfers = (curr.legs.length > 0 ? 1 : 0) + lineTransfers;

        if (curr.transfers + addedTransfers > MAX_TRANSFERS) return;

        const travelMins = (stopCount * MRT_MIN) + (addedTransfers * TRANSFER_PENALTY);
        const systemAlerts = buildAlerts(intermediateLegs);

        queue.push({
          type: "mrt",
          currentCode: targetStation.name,
          currentName: targetStation.name,
          lat: targetStation.lat,
          lng: targetStation.lng,
          estMins: curr.estMins + travelMins,
          transfers: curr.transfers + addedTransfers,
          legs: [...curr.legs, ...intermediateLegs],
          alerts: [...curr.alerts, ...systemAlerts]
        });
      });

      // Transfer Option: Walk from this MRT Station to a nearby Bus Stop
      const adjacentBusStops = nearbyBusStops(curr.lat, curr.lng);
      adjacentBusStops.forEach(bs => {
        if (curr.legs.length > 0 && curr.legs[curr.legs.length - 1].line === "BUS") return;

        const walkTime = bs.d / 80;
        queue.push({
          type: "bus",
          currentCode: bs.code,
          currentName: bs.name,
          lat: bs.lat,
          lng: bs.lng,
          estMins: curr.estMins + walkTime,
          transfers: curr.transfers,
          legs: curr.legs,
          alerts: curr.alerts
        });
      });
    }
  }

  // Final pipeline: Sort by travel execution efficiency and clear near-identical duplicate profiles
  const seenKey = new Set();
  const dedupedRoutes = [];
  const sortedRoutes = routes.sort((a, b) => a.estMins - b.estMins || a.transfers - b.transfers);

  for (const r of sortedRoutes) {
    const signature = `${r.transfers}-${Math.round(r.estMins)}-${r.legs.map(l => l.serviceNo || l.line).join("|")}`;
    if (!seenKey.has(signature)) {
      seenKey.add(signature);
      dedupedRoutes.push(r);
    }
  }

  return dedupedRoutes.slice(0, 5);
}

function NearbyStopPicker({ stops, selectedCoord, onPick }) {
  if (!stops.length) return null;
  return (
    <div style={{ marginTop:-6, marginBottom:10 }}>
      <div style={{ color:"#374151", fontSize:11, marginBottom:5 }}>Tap your stop:</div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {stops.map(s => {
          const active = selectedCoord?.lat === s.lat;
          return (
            <button key={s.code} onClick={() => onPick(s)}
              style={{ background:active?"#0a2a1a":"#161B27", border:`1px solid ${active?"#16a34a":"#1E2D40"}`, borderRadius:9, padding:"8px 12px", color:active?"#4ade80":"#9CA3AF", fontSize:12, cursor:"pointer", textAlign:"left" }}>
              <span style={{ fontWeight:700, fontFamily:"DM Mono", marginRight:8 }}>{s.code}</span>{s.name}
              <span style={{ color:"#374151", fontSize:10, marginLeft:6 }}>{Math.round(s.d)}m</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MixedInputPanel({ onTrack }) {
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal,   setToPostal]   = useState("");
  const [fromStatus, setFromStatus] = useState("idle");
  const [toStatus,   setToStatus]   = useState("idle");
  const [fromCoord,  setFromCoord]  = useState(null);
  const [toCoord,    setToCoord]    = useState(null);
  const [fromAddr,   setFromAddr]   = useState("");
  const [toAddr,     setToAddr]     = useState("");
  const [fromNearby, setFromNearby] = useState([]);
  const [toNearby,   setToNearby]   = useState([]);
  const [fromPicked, setFromPicked] = useState(false);
  const [toPicked,   setToPicked]   = useState(false);
  const [routes,     setRoutes]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [selected,   setSelected]   = useState(null);
  const debounce = useRef({});

  function handlePostal(side, val) {
    const v = val.replace(/\D/g, "").slice(0, 6);
    if (side === "from") { setFromPostal(v); setFromCoord(null); setFromAddr(""); setFromNearby([]); setFromPicked(false); setFromStatus(v.length === 6 ? "loading" : "idle"); }
    else                 { setToPostal(v);   setToCoord(null);   setToAddr("");   setToNearby([]);   setToPicked(false);   setToStatus(v.length === 6 ? "loading" : "idle"); }
    if (v.length !== 6) return;
    clearTimeout(debounce.current[side]);
    debounce.current[side] = setTimeout(async () => {
      try {
        const r = await geocodePostal(v);
        const nearby = Object.entries(BUS_STOPS)
          .map(([code, sv]) => ({ code, lat:sv[0], lng:sv[1], name:sv[2], d:haversineM(r.lat, r.lng, sv[0], sv[1]) }))
          .filter(s => s.d <= 600).sort((a,b) => a.d - b.d).slice(0, 3);
        const nearest = nearby[0];
        if (side === "from") {
          setFromCoord(nearest ? { lat:nearest.lat, lng:nearest.lng } : { lat:r.lat, lng:r.lng });
          setFromAddr(nearest ? nearest.name : r.address);
          setFromNearby(nearby);
          setFromPicked(false);
          setFromStatus("ok");
        } else {
          setToCoord(nearest ? { lat:nearest.lat, lng:nearest.lng } : { lat:r.lat, lng:r.lng });
          setToAddr(nearest ? nearest.name : r.address);
          setToNearby(nearby);
          setToPicked(false);
          setToStatus("ok");
        }
      } catch {
        if (side === "from") setFromStatus("error");
        else setToStatus("error");
      }
    }, 600);
  }

  function search() {
    if (!fromCoord || !toCoord) return;
    setLoading(true); setRoutes(null); setSelected(null);
    setTimeout(() => {
      try {
        const results = computeMixedRoutes(fromCoord.lat, fromCoord.lng, toCoord.lat, toCoord.lng);
        setRoutes(results);
      } catch(e) { console.error(e); setRoutes([]); }
      setLoading(false);
    }, 50);
  }

  const typeLabel = { mrt: "🚇 MRT", bus: "🚌 Bus", "bus+mrt": "🚌→🚇 Bus + MRT", "mrt+bus": "🚇→🚌 MRT + Bus" };
  const typeColor = { mrt: "#D42E12", bus: "#F59E0B", "bus+mrt": "#9D5918", "mrt+bus": "#005EC4" };

  return (
    <>
      <PostalInput label="From (postal code)" value={fromPostal} onChange={v => handlePostal("from", v)} status={fromStatus} station={fromAddr ? { name: fromAddr } : null}
        extra={<NearMeButton onFound={pos => {
          const nearby = Object.entries(BUS_STOPS)
            .map(([code, v]) => ({ code, lat:v[0], lng:v[1], name:v[2], d:haversineM(pos.lat, pos.lng, v[0], v[1]) }))
            .filter(s => s.d <= 400).sort((a,b) => a.d - b.d).slice(0, 3);
          setFromNearby(nearby);
          setFromPicked(false);
          if (nearby[0]) { setFromCoord({ lat:nearby[0].lat, lng:nearby[0].lng }); setFromAddr(nearby[0].name); setFromPostal(nearby[0].code); setFromStatus("ok"); }
        }} />} />
      {fromNearby.length > 0 && !fromPicked && (
        <NearbyStopPicker stops={fromNearby} selectedCoord={fromCoord} onPick={s => { setFromCoord({ lat:s.lat, lng:s.lng }); setFromAddr(s.name); setFromPostal(s.code); setFromPicked(true); setFromNearby([]); }} />
      )}
      <PostalInput label="To (postal code)"   value={toPostal}   onChange={v => handlePostal("to",   v)} status={toStatus}   station={toAddr   ? { name: toAddr }   : null} />
      {toNearby.length > 0 && !toPicked && (
        <NearbyStopPicker stops={toNearby} selectedCoord={toCoord} onPick={s => { setToCoord({ lat:s.lat, lng:s.lng }); setToAddr(s.name); setToPostal(s.code); setToPicked(true); setToNearby([]); }} />
      )}

      <button disabled={!fromCoord || !toCoord || loading} onClick={search}
        style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:fromCoord&&toCoord&&!loading?"#2563EB":"#1E2D40", color:fromCoord&&toCoord&&!loading?"#fff":"#374151", fontSize:14, fontWeight:800, cursor:fromCoord&&toCoord&&!loading?"pointer":"not-allowed" }}>
        {loading ? "Finding routes…" : "Find Best Routes"}
      </button>

      {routes && routes.length === 0 && (
        <div style={{ color:"#EF4444", fontSize:12, marginTop:10, paddingLeft:4 }}>No routes found between these locations.</div>
      )}

      {routes && routes.length > 0 && (
        <div style={{ marginTop:16 }}>
          <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>Routes found</div>
          {routes.map((r, i) => (
            <button key={i} onClick={() => setSelected(i)}
              style={{ width:"100%", marginBottom:8, padding:"12px 14px", borderRadius:12, border:`1px solid ${selected===i?typeColor[r.type]:"#1E2D40"}`, background:selected===i?"#0a1628":"#0D1117", cursor:"pointer", textAlign:"left" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:typeColor[r.type]||"#fff", fontSize:13, fontWeight:800 }}>{typeLabel[r.type]||r.type}</span>
                <span style={{ color:"#6B7280", fontSize:11 }}>{r.transfers} transfer{r.transfers!==1?"s":""} · ~{r.estMins}min</span>
              </div>
              <div style={{ color:"#4B5563", fontSize:11, marginTop:3 }}>{r.label}</div>
            </button>
          ))}
          {selected !== null && (
            <button onClick={() => onTrack(routes[selected])}
              style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"#D42E12", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 8px 24px rgba(212,46,18,.3)", marginTop:4 }}>
              Track This Route →
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────
const S = { INPUT:0, CONFIRM:1, TRACKING:2, DONE:3 };

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState(S.INPUT);
  const [inputMode, setInputMode]   = useState("station");
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal]     = useState("");
  const [fromStatus, setFromStatus] = useState("idle");
  const [toStatus, setToStatus]     = useState("idle");
  const [fromStation, setFromStation] = useState(null);
  const [toStation, setToStation]     = useState(null);
  const [route, setRoute]           = useState(null);
  const [routeMode, setRouteMode]   = useState("fastest");
  const [routeError, setRouteError] = useState(null);
  const [nearMeDebug, setNearMeDebug] = useState(null);

  const [gpsStatus, setGpsStatus]       = useState("idle");
  const [distanceM, setDistanceM]       = useState(null);
  const [currentPos, setCurrentPos]     = useState(null);
  const [activeAlertIdx, setActiveAlertIdx] = useState(null);
  const [showMissed, setShowMissed]     = useState(false);
  const [passedStopIdx, setPassedStopIdx] = useState(-1);
  const [simProgress, setSimProgress]   = useState(0);
  const [useSimMode, setUseSimMode]     = useState(false);

  const watchRef   = useRef(null);
  const simRef     = useRef(null);
  const firedRef   = useRef(new Set());
  const simProgressRef = useRef(0);
  const debounceRef = useRef({});

  function handlePostal(side, val) {
    if (side==="from") { setFromPostal(val); setFromStation(null); setFromStatus(val.length===6?"loading":"idle"); }
    else               { setToPostal(val);   setToStation(null);   setToStatus(val.length===6?"loading":"idle"); }
    if (val.length !== 6) return;
    clearTimeout(debounceRef.current[side]);
    debounceRef.current[side] = setTimeout(async () => {
      try {
        const { lat, lng } = await geocodePostal(val);
        const st = nearestStation(lat, lng);
        if (side==="from") { setFromStation(st); setFromStatus("ok"); }
        else               { setToStation(st);   setToStatus("ok"); }
      } catch {
        if (side==="from") setFromStatus("error");
        else setToStatus("error");
      }
    }, 600);
  }

  function buildRoute(mode) {
    const m = mode || routeMode;
    if (!fromStation || !toStation) return;
    if (fromStation.name === toStation.name) { setRouteError("Origin and destination are the same."); return; }
    const codePath = m==="least-transfers"
      ? findPathFewestTransfers(fromStation.name, toStation.name)
      : findPath(fromStation.name, toStation.name);
    if (!codePath) { setRouteError("No route found."); return; }
    const legs = pathToLegs(codePath);
    if (!legs.length) { setRouteError("Could not build route legs."); return; }
    const alerts = buildAlerts(legs);
    const uniqueNames = [...new Set(codePath.map(c => STATIONS.find(s => s.code===c)?.name))];
    setRoute({ legs, alerts, codePath, stopCount:uniqueNames.length-1, transfers:legs.length-1, mode:m, fromName:fromStation.name, toName:toStation.name });
    setRouteError(null);
    setScreen(S.CONFIRM);
  }

  // Flat stop list deduplicated by consecutive name (handles transfer stations)
  function getStopsFlat(r) {
    if (!r) return [];
    const raw = r.legs.flatMap(l => l.stops);
    return raw.filter((s,i) => i===0 || s.name !== raw[i-1].name);
  }

  function processPosition(lat, lng) {
    if (!route) return;
    setCurrentPos({ lat, lng });
    const allStops = getStopsFlat(route);
    setPassedStopIdx(prev => {
      const start = Math.max(0, prev);
      let idx = prev;
      for (let i = start; i < allStops.length-1; i++) {
        const dCur  = haversineM(lat, lng, allStops[i].lat,   allStops[i].lng);
        const dNext = haversineM(lat, lng, allStops[i+1].lat, allStops[i+1].lng);
        if (dNext < dCur) { idx = i+1; } else { break; }
      }
      return idx;
    });
    const nextAlert = route.alerts.find(a => !firedRef.current.has(a.id));
    if (!nextAlert) return;
    const d = haversineM(lat, lng, nextAlert.lat, nextAlert.lng);
    setDistanceM(Math.round(d));
    if (d <= nextAlert.radiusM) {
      firedRef.current.add(nextAlert.id);
      vibrate(nextAlert.vibratePattern);
      const idx = route.alerts.findIndex(a => a.id===nextAlert.id);
      setActiveAlertIdx(idx);
      setShowMissed(false);
      if (nextAlert.type==="alight") setTimeout(() => setScreen(S.DONE), 3000);
    }
  }

  function startGPS() {
    setGpsStatus("requesting");
    if (!navigator.geolocation) { setGpsStatus("denied"); return; }
    watchRef.current = navigator.geolocation.watchPosition(
      pos => { setGpsStatus("ok"); processPosition(pos.coords.latitude, pos.coords.longitude); },
      () => setGpsStatus("denied"),
      { enableHighAccuracy:false, maximumAge:60000, timeout:20000 }
    );
  }

  function startSim() {
    if (!route) return;
    setUseSimMode(true); setGpsStatus("simulating");
    setSimProgress(0); simProgressRef.current = 0;
    firedRef.current = new Set(); setActiveAlertIdx(null); setShowMissed(false);
    const waypoints = route.legs.flatMap(l => l.stops).filter((s,i,arr) => arr.findIndex(x => x.code===s.code)===i).filter(s => s.lat && s.lng);
    if (waypoints.length < 2) return;
    const total = waypoints.length;
    let stopIdx = 0, segProg = 0;
    let unmounted = false;
    simRef.current = setInterval(() => {
      if (unmounted) { clearInterval(simRef.current); return; }
      segProg += 0.06;
      if (segProg >= 1) { segProg = 0; stopIdx = Math.min(stopIdx+1, total-2); }
      const from = waypoints[stopIdx], to = waypoints[stopIdx+1];
      const lat = from.lat + (to.lat-from.lat)*segProg;
      const lng = from.lng + (to.lng-from.lng)*segProg;
      const overall = (stopIdx+segProg)/(total-1);
      setSimProgress(overall); simProgressRef.current = overall;
      processPosition(lat, lng);
      if (stopIdx >= total-2 && segProg >= 0.99) clearInterval(simRef.current);
    }, 120);
    return () => { unmounted = true; clearInterval(simRef.current); };
  }

  function stopTracking() {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    if (simRef.current) clearInterval(simRef.current);
  }

  function resetAll() {
    stopTracking(); firedRef.current = new Set();
    setScreen(S.INPUT); setFromPostal(""); setToPostal("");
    setFromStatus("idle"); setToStatus("idle");
    setFromStation(null); setToStation(null); setRoute(null); setRouteError(null);
    setGpsStatus("idle"); setDistanceM(null); setCurrentPos(null);
    setActiveAlertIdx(null); setShowMissed(false);
    setSimProgress(0); setUseSimMode(false); simProgressRef.current = 0; setPassedStopIdx(-1);
  }

  useEffect(() => () => stopTracking(), []);

  const canBuildRoute = fromStation && toStation;
  const activeAlert = route && activeAlertIdx !== null ? route.alerts[activeAlertIdx] : null;
  const nextUnfiredAlert = route ? route.alerts.find(a => !firedRef.current.has(a.id)) : null;
  const allStopsFlat = getStopsFlat(route);
  const simStopIdx = useSimMode ? Math.min(Math.floor(simProgress * allStopsFlat.length), allStopsFlat.length-1) : -1;

  function NearMeBtn({ onFound, style }) {
    return (
      <button onClick={() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude:lat, longitude:lng } = pos.coords;
          const s = nearestStation(lat, lng);
          setNearMeDebug(`GPS: ${lat.toFixed(4)},${lng.toFixed(4)} → ${s?.name ?? "none"} (${s ? Math.round(haversineM(lat,lng,s.lat,s.lng)) : "?"}m)`);
          if (s) onFound(s);
        }, null, { enableHighAccuracy:true, timeout:8000 });
      }} style={{ background:"#1E2D40", border:"1px solid #2D3F55", borderRadius:8, color:"#60A5FA", fontSize:11, fontWeight:700, padding:"0 8px", height:24, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap", lineHeight:"24px", ...style }}>
        📍 Near me
      </button>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#080C14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', -apple-system, sans-serif", padding:20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes ripple { 0%{transform:scale(.5);opacity:.9} 100%{transform:scale(2.5);opacity:0} }
        @keyframes bounceIn { 0%{transform:scale(.3);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes trainSlide { 0%{transform:translateX(-3px)} 50%{transform:translateX(3px)} 100%{transform:translateX(-3px)} }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
        input { -webkit-appearance:none; }
      `}</style>

      <div style={{ width:"100%", maxWidth:390, minHeight:780, background:"#0D1117", borderRadius:50, overflow:"hidden", boxShadow:"0 50px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.07)", display:"flex", flexDirection:"column" }}>

        {/* Status bar */}
        <div style={{ height:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0 }}>
          <span style={{ color:"#fff", fontSize:15, fontWeight:600, fontFamily:"DM Mono" }}>9:41</span>
          <div style={{ width:126, height:34, background:"#000", borderRadius:20, position:"absolute", left:"50%", transform:"translateX(-50%)" }} />
          <span style={{ color:"#fff", fontSize:13, opacity:.7 }}>●●● ▲</span>
        </div>

        {/* ── INPUT SCREEN ── */}
        {screen === S.INPUT && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 22px 32px", animation:"fadeUp .5s ease" }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ width:50, height:50, borderRadius:15, background:"#D42E12", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14, boxShadow:"0 8px 24px rgba(212,46,18,.4)" }}>🚇</div>
              <h1 style={{ color:"#fff", fontSize:26, fontWeight:800, margin:"0 0 4px", letterSpacing:"-.5px" }}>SG Transit Alert</h1>
              <p style={{ color:"#374151", fontSize:13, margin:0 }}>Wake me up at my stop.</p>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", background:"#161B27", borderRadius:12, padding:4, marginBottom:18, border:"1px solid #1E2D40" }}>
              {[["station","🚉 MRT"],["bus","🚌 Bus"],["mixed","🔀 Mixed"]].map(([mode, label]) => (
                <button key={mode}
                  onClick={() => { setInputMode(mode); setFromStation(null); setToStation(null); setFromPostal(""); setToPostal(""); setFromStatus("idle"); setToStatus("idle"); setRouteError(null); }}
                  style={{ flex:1, padding:"9px 6px", borderRadius:9, border:"none", background:inputMode===mode?"#0D1117":"transparent", color:inputMode===mode?"#fff":"#4B5563", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .2s", boxShadow:inputMode===mode?"0 2px 8px rgba(0,0,0,.4)":"none" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* MRT mode */}
            {inputMode === "station" && (
              <>
                <StationPicker label="From" value={fromStation} onChange={st => { setFromStation(st); setRouteError(null); }}
                  extra={<NearMeBtn onFound={st => { setFromStation(st); setRouteError(null); }} />} />
                {nearMeDebug && <div style={{ color:"#6B7280", fontSize:10, fontFamily:"DM Mono", padding:"2px 2px 6px", wordBreak:"break-all" }}>{nearMeDebug}</div>}
                <StationPicker label="To" value={toStation} onChange={st => { setToStation(st); setRouteError(null); }} />
                <div style={{ marginBottom:16 }}>
                  <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:8 }}>Quick picks</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {[{label:"Sembawang → Lavender",from:"Sembawang",to:"Lavender"},{label:"Orchard → Bugis",from:"Orchard",to:"Bugis"},{label:"Jurong East → Expo",from:"Jurong East",to:"Expo"}].map((eg,i) => (
                      <button key={i} onClick={() => { const f=UNIQUE_STATIONS.find(s=>s.name===eg.from); const t=UNIQUE_STATIONS.find(s=>s.name===eg.to); if(f)setFromStation(f); if(t)setToStation(t); setRouteError(null); }}
                        style={{ background:"#161B27", border:"1px solid #1E2D40", borderRadius:10, padding:"6px 12px", color:"#6B7280", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                        {eg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Postal mode (hidden tab - accessible via station picker still but keeping for backwards compat) */}
            {inputMode === "postal" && (
              <>
                <PostalInput label="From (postal code)" value={fromPostal} onChange={v => handlePostal("from",v)} status={fromStatus} station={fromStation}
                  extra={<NearMeBtn onFound={st => { setFromStation(st); setFromStatus("ok"); setRouteError(null); }} />} />
                <PostalInput label="To (postal code)" value={toPostal} onChange={v => handlePostal("to",v)} status={toStatus} station={toStation} />
              </>
            )}

            {/* Bus mode */}
            {inputMode === "bus" && (
              <BusInputPanel onTrack={r => { setRoute(r); setScreen(S.CONFIRM); }} />
            )}

            {/* Mixed mode */}
            {inputMode === "mixed" && (
              <MixedInputPanel onTrack={r => { setRoute(r); setScreen(S.CONFIRM); }} />
            )}

            {routeError && <div style={{ color:"#EF4444", fontSize:12, marginBottom:10, paddingLeft:4 }}>{routeError}</div>}

            {/* Bottom actions — only show for MRT/postal modes */}
            {(inputMode === "station" || inputMode === "postal") && (
              <div style={{ marginTop:"auto" }}>
                <div style={{ background:"#0D1117", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", gap:10, border:"1px solid #1E2D40" }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>🔋</span>
                  <p style={{ color:"#374151", fontSize:11, margin:0, lineHeight:1.5 }}><b style={{ color:"#4B5563" }}>Battery-friendly:</b> WiFi/cell location, not GPS chip.</p>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => { setRouteMode("fastest"); buildRoute("fastest"); }} disabled={!canBuildRoute}
                    style={{ flex:1, padding:"14px 8px", borderRadius:14, border:"none", background:canBuildRoute?"#D42E12":"#161B27", color:canBuildRoute?"#fff":"#374151", fontSize:13, fontWeight:700, cursor:canBuildRoute?"pointer":"not-allowed", boxShadow:canBuildRoute?"0 8px 24px rgba(212,46,18,.4)":"none", transition:"all .3s" }}>
                    ⚡ Fewest Stops
                  </button>
                  <button onClick={() => { setRouteMode("least-transfers"); buildRoute("least-transfers"); }} disabled={!canBuildRoute}
                    style={{ flex:1, padding:"14px 8px", borderRadius:14, border:"none", background:canBuildRoute?"#1D4ED8":"#161B27", color:canBuildRoute?"#fff":"#374151", fontSize:13, fontWeight:700, cursor:canBuildRoute?"pointer":"not-allowed", boxShadow:canBuildRoute?"0 8px 24px rgba(29,78,216,.4)":"none", transition:"all .3s" }}>
                    🔁 Least Transfers
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONFIRM SCREEN ── */}
        {screen === S.CONFIRM && route && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 22px 28px", animation:"fadeUp .4s ease" }}>
            <button onClick={() => setScreen(S.INPUT)} style={{ background:"#161B27", border:"none", color:"#6B7280", width:36, height:36, borderRadius:10, cursor:"pointer", fontSize:18, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
            <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:"0 0 2px" }}>Your route</h2>
            <p style={{ color:"#374151", fontSize:12, margin:"0 0 14px" }}>
              {route.fromName} → {route.toName} · {route.stopCount} stops · {route.transfers} transfer{route.transfers!==1?"s":""}
            </p>

            {!route.isBus && (
              <button onClick={() => { const alt=route.mode==="least-transfers"?"fastest":"least-transfers"; setRouteMode(alt); buildRoute(alt); }}
                style={{ background:"#161B27", border:"1px solid #1E2D40", borderRadius:10, padding:"7px 14px", color:"#6B7280", fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:14, alignSelf:"flex-start" }}>
                ↔ Try {route.mode==="least-transfers"?"fewest stops":"least transfers"} instead
              </button>
            )}

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["⇄","Transfer alert","#F59E0B","#1c1400"],["↓","Alight alert","#009645","#052e16"]].map(([icon,label,color,bg],i) => (
                <div key={i} style={{ flex:1, background:bg, border:`1px solid ${color}33`, borderRadius:10, padding:"6px 10px", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color, fontSize:13 }}>{icon}</span>
                  <span style={{ color, fontSize:10, fontWeight:700 }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"#161B27", borderRadius:18, padding:"12px 12px 12px 8px", flex:1, overflowY:"auto", border:"1px solid #1E2D40", marginBottom:14 }}>
              {route.legs.map((leg, li) => {
                const meta = LINE_META[leg.line] || { color:"#666", label:leg.line };
                return (
                  <div key={li}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, marginLeft:26 }}>
                      <LinePill line={leg.line} small />
                      {leg.serviceNo && <span style={{ color:"#6B7280", fontSize:11 }}>Bus {leg.serviceNo}</span>}
                      {!leg.serviceNo && <span style={{ color:"#374151", fontSize:10 }}>{meta.label}</span>}
                    </div>
                    {leg.stops.map((stop, si) => {
                      const isTransfer = route.alerts.find(a => a.stopCode===stop.code && a.type==="transfer");
                      const isAlight   = route.alerts.find(a => a.stopCode===stop.code && a.type==="alight");
                      const gIdx = allStopsFlat.findIndex(x => x.code===stop.code);
                      return <StopRow key={stop.code+si} stop={stop} color={meta.color} isFirst={si===0} isLast={si===leg.stops.length-1} isTransferAlert={!!isTransfer} isAlightAlert={!!isAlight} passed={passedStopIdx>gIdx} active={passedStopIdx===gIdx} />;
                    })}
                    {li < route.legs.length-1 && (
                      <div style={{ marginLeft:26, marginTop:2, marginBottom:8 }}>
                        <span style={{ color:"#92400E", fontSize:10, fontWeight:600 }}>⇄ Transfer → {LINE_META[route.legs[li+1].line]?.short}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setScreen(S.TRACKING); startGPS(); }} style={{ width:"100%", padding:15, borderRadius:14, border:"none", background:"#D42E12", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 24px rgba(212,46,18,.4)", marginBottom:8 }}>
              📍 Start Tracking
            </button>
            <button onClick={() => { setScreen(S.TRACKING); startSim(); }} style={{ width:"100%", padding:12, borderRadius:14, border:"1px solid #1E2D40", background:"transparent", color:"#4B5563", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              🎮 Demo Mode
            </button>
          </div>
        )}

        {/* ── TRACKING SCREEN ── */}
        {screen === S.TRACKING && route && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"14px 20px 24px", animation:"fadeUp .4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <button onClick={() => { stopTracking(); setScreen(S.CONFIRM); }} style={{ background:"#161B27", border:"none", color:"#6B7280", width:34, height:34, borderRadius:10, cursor:"pointer", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
              <div>
                <h2 style={{ color:"#fff", fontSize:16, fontWeight:800, margin:0 }}>
                  {route.isBus ? `Bus ${route.serviceNo}` : "Tracking"} · {route.fromName} → {route.toName}
                </h2>
                <p style={{ color:"#374151", fontSize:11, margin:0 }}>
                  {gpsStatus==="ok"?"📍 Low-power GPS on":gpsStatus==="simulating"?"🎮 Demo":gpsStatus==="denied"?"⚠️ GPS denied":"Acquiring…"}
                </p>
              </div>
            </div>

            {activeAlert && !showMissed && (
              <div style={{ marginBottom:10 }}>
                <AlertBanner alert={activeAlert}
                  onMissed={() => { setShowMissed(true); setActiveAlertIdx(null); }}
                  onTransferred={() => { firedRef.current.add(activeAlert.id); setActiveAlertIdx(null); }} />
              </div>
            )}
            {showMissed && (
              <div style={{ marginBottom:10 }}>
                <MissedPanel alerts={route.alerts} firedCount={firedRef.current.size} onDismiss={() => setShowMissed(false)} />
              </div>
            )}

            {!activeAlert && !showMissed && (
              <div style={{ background:"#161B27", border:"1px solid #1E2D40", borderRadius:14, padding:"14px", marginBottom:10, textAlign:"center" }}>
                {(() => {
                  if (!nextUnfiredAlert) return <div style={{ color:"#374151", fontSize:13, padding:"4px 0" }}>On your way…</div>;
                  const currentIdx = useSimMode ? simStopIdx : passedStopIdx;
                  const nextStop = allStopsFlat[currentIdx+1];
                  if (useSimMode ? simStopIdx >= 0 : currentPos) {
                    return (
                      <>
                        <div style={{ color:"#374151", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", marginBottom:6 }}>Next stop</div>
                        <div style={{ color:"#fff", fontSize:28, fontWeight:800, lineHeight:1.1 }}>{nextStop?.name ?? nextUnfiredAlert.stopName}</div>
                        {nextStop && nextStop.code !== nextUnfiredAlert.stopCode && (
                          <div style={{ color:"#374151", fontSize:11, marginTop:6 }}>
                            then <span style={{ color:nextUnfiredAlert.type==="transfer"?"#F59E0B":"#9CA3AF", fontWeight:600 }}>{nextUnfiredAlert.stopName}</span>
                            {nextUnfiredAlert.type==="transfer" && <span style={{ color:"#F59E0B" }}> · transfer</span>}
                            {nextUnfiredAlert.type==="alight"   && <span style={{ color:"#9CA3AF" }}> · alight</span>}
                          </div>
                        )}
                        {nextStop?.code === nextUnfiredAlert.stopCode && (
                          <div style={{ color:nextUnfiredAlert.type==="transfer"?"#F59E0B":"#4ade80", fontSize:11, marginTop:4, fontWeight:600 }}>
                            {nextUnfiredAlert.type==="transfer" ? "⇄ transfer here" : "↓ alight here"}
                          </div>
                        )}
                      </>
                    );
                  }
                  return <div style={{ color:"#374151", fontSize:13, animation:"pulse2 1.2s ease infinite", padding:"4px 0" }}>{gpsStatus==="denied"?"GPS blocked — use Demo Mode":"Waiting for location…"}</div>;
                })()}
              </div>
            )}

            {useSimMode && (
              <div style={{ marginBottom:10 }}>
                <div style={{ height:3, background:"#161B27", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${simProgress*100}%`, background:"linear-gradient(90deg,#D42E12,#009645)", transition:"width .2s" }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
                  <span style={{ color:"#374151", fontSize:10 }}>{route.fromName}</span>
                  <span style={{ fontSize:12, animation:"trainSlide 1s ease infinite" }}>🚇</span>
                  <span style={{ color:"#374151", fontSize:10 }}>{route.toName}</span>
                </div>
              </div>
            )}

            <div style={{ background:"#161B27", borderRadius:18, padding:"12px 12px 12px 8px", flex:1, overflowY:"auto", border:"1px solid #1E2D40" }}>
              {route.legs.map((leg, li) => {
                const meta = LINE_META[leg.line] || { color:"#666" };
                const curIdx = useSimMode ? simStopIdx : passedStopIdx;
                return (
                  <div key={li}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, marginLeft:26 }}>
                      <LinePill line={leg.line} small />
                      {leg.serviceNo && <span style={{ color:"#6B7280", fontSize:11 }}>Bus {leg.serviceNo}</span>}
                    </div>
                    {leg.stops.map((stop, si) => {
                      const isTransfer = route.alerts.find(a => a.stopCode===stop.code && a.type==="transfer");
                      const isAlight   = route.alerts.find(a => a.stopCode===stop.code && a.type==="alight");
                      const gIdx = allStopsFlat.findIndex(s => s.code===stop.code);
                      return <StopRow key={stop.code+si} stop={stop} color={meta.color} isFirst={si===0} isLast={si===leg.stops.length-1} isTransferAlert={!!isTransfer} isAlightAlert={!!isAlight} passed={curIdx>gIdx} active={curIdx===gIdx} />;
                    })}
                    {li < route.legs.length-1 && (
                      <div style={{ marginLeft:26, marginTop:2, marginBottom:8 }}>
                        <span style={{ color:"#92400E", fontSize:10, fontWeight:600 }}>⇄ {LINE_META[route.legs[li+1].line]?.short}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!activeAlert && !showMissed && distanceM != null && distanceM <= 600 && (
              <button onClick={() => setShowMissed(true)} style={{ marginTop:10, width:"100%", padding:"10px", borderRadius:12, border:"1px solid #1E2D40", background:"transparent", color:"#374151", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                😬 I missed my stop
              </button>
            )}
          </div>
        )}

        {/* ── DONE SCREEN ── */}
        {screen === S.DONE && route && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", animation:"fadeUp .5s ease" }}>
            <div style={{ position:"relative", width:120, height:120, marginBottom:28 }}>
              {[0,1,2].map(i => (<div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #009645", opacity:0, animation:`ripple 1.8s ease-out ${i*.5}s infinite` }} />))}
              <div style={{ position:"absolute", inset:16, borderRadius:"50%", background:"#009645", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, boxShadow:"0 0 40px rgba(0,150,69,.6)", animation:"bounceIn .6s cubic-bezier(.34,1.56,.64,1)" }}>🔔</div>
            </div>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, margin:"0 0 4px" }}>Alight now!</h2>
            <p style={{ color:"#009645", fontSize:16, fontWeight:700, margin:"0 0 24px" }}>{route.toName}</p>
            <div style={{ width:"100%", background:"#161B27", borderRadius:18, padding:18, marginBottom:20, border:"1px solid #1E2D40" }}>
              {[["From",route.fromName],["To",route.toName],["Mode",route.isBus?`Bus ${route.serviceNo}`:route.legs.map(l=>LINE_META[l.line]?.short).join(" → ")],["Stops",route.stopCount]].map(([l,v],i,arr) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<arr.length-1?"1px solid #0D1117":"none" }}>
                  <span style={{ color:"#4B5563", fontSize:13 }}>{l}</span>
                  <span style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={resetAll} style={{ width:"100%", padding:16, borderRadius:16, border:"none", background:"#009645", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 24px rgba(0,150,69,.4)" }}>
              Plan Another Journey →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
