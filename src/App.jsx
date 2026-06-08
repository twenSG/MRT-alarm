import { useState, useEffect, useRef } from "react";

// ─── MRT STATION DATABASE ────────────────────────────────────────────────────
// All major stations with real coordinates, line colours, and interchange info
const STATIONS = [
  // NSL — North South Line (#D42E12)
  { code:"NS1",  name:"Jurong East",    lat:1.3332, lng:103.7420, lines:["NSL","EWL"] },
  { code:"NS2",  name:"Bukit Batok",    lat:1.3490, lng:103.7496, lines:["NSL"] },
  { code:"NS3",  name:"Bukit Gombak",   lat:1.3587, lng:103.7516, lines:["NSL"] },
  { code:"NS4",  name:"Choa Chu Kang",  lat:1.3854, lng:103.7443, lines:["NSL","LRT"] },
  { code:"NS5",  name:"Yew Tee",        lat:1.3970, lng:103.7474, lines:["NSL"] },
  { code:"NS7",  name:"Kranji",         lat:1.4252, lng:103.7620, lines:["NSL"] },
  { code:"NS8",  name:"Marsiling",      lat:1.4326, lng:103.7742, lines:["NSL"] },
  { code:"NS9",  name:"Woodlands",      lat:1.4371, lng:103.7865, lines:["NSL","TEL"] },
  { code:"NS10", name:"Admiralty",      lat:1.4408, lng:103.8008, lines:["NSL"] },
  { code:"NS11", name:"Sembawang",      lat:1.4490, lng:103.8202, lines:["NSL"] },
  { code:"NS12", name:"Canberra",       lat:1.4431, lng:103.8297, lines:["NSL"] },
  { code:"NS13", name:"Yishun",         lat:1.4295, lng:103.8352, lines:["NSL"] },
  { code:"NS14", name:"Khatib",         lat:1.4172, lng:103.8329, lines:["NSL"] },
  { code:"NS15", name:"Yio Chu Kang",   lat:1.3816, lng:103.8449, lines:["NSL"] },
  { code:"NS16", name:"Ang Mo Kio",     lat:1.3700, lng:103.8495, lines:["NSL"] },
  { code:"NS17", name:"Bishan",         lat:1.3510, lng:103.8484, lines:["NSL","CCL"] },
  { code:"NS18", name:"Braddell",       lat:1.3400, lng:103.8469, lines:["NSL"] },
  { code:"NS19", name:"Toa Payoh",      lat:1.3325, lng:103.8474, lines:["NSL"] },
  { code:"NS20", name:"Novena",         lat:1.3204, lng:103.8437, lines:["NSL"] },
  { code:"NS21", name:"Newton",         lat:1.3131, lng:103.8384, lines:["NSL","DTL"] },
  { code:"NS22", name:"Orchard",        lat:1.3040, lng:103.8318, lines:["NSL","TEL"] },
  { code:"NS23", name:"Somerset",       lat:1.3006, lng:103.8389, lines:["NSL"] },
  { code:"NS24", name:"Dhoby Ghaut",    lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"NS25", name:"City Hall",      lat:1.2931, lng:103.8520, lines:["NSL","EWL"] },
  { code:"NS26", name:"Raffles Place",  lat:1.2840, lng:103.8516, lines:["NSL","EWL"] },
  { code:"NS27", name:"Marina Bay",     lat:1.2764, lng:103.8546, lines:["NSL","CEL","TEL"] },
  { code:"NS28", name:"Marina South Pier",lat:1.2706,lng:103.8631,lines:["NSL"] },

  // EWL — East West Line (#009645)
  { code:"EW1",  name:"Pasir Ris",      lat:1.3731, lng:103.9494, lines:["EWL"] },
  { code:"EW2",  name:"Tampines",       lat:1.3529, lng:103.9454, lines:["EWL","DTL"] },
  { code:"EW3",  name:"Simei",          lat:1.3432, lng:103.9531, lines:["EWL"] },
  { code:"EW4",  name:"Tanah Merah",    lat:1.3273, lng:103.9462, lines:["EWL","CGL"] },
  { code:"EW5",  name:"Bedok",          lat:1.3240, lng:103.9300, lines:["EWL"] },
  { code:"EW6",  name:"Kembangan",      lat:1.3209, lng:103.9126, lines:["EWL"] },
  { code:"EW7",  name:"Eunos",          lat:1.3197, lng:103.9027, lines:["EWL"] },
  { code:"EW8",  name:"Paya Lebar",     lat:1.3180, lng:103.8922, lines:["EWL","CCL"] },
  { code:"EW9",  name:"Aljunied",       lat:1.3164, lng:103.8828, lines:["EWL"] },
  { code:"EW10", name:"Kallang",        lat:1.3112, lng:103.8714, lines:["EWL"] },
  { code:"EW11", name:"Lavender",       lat:1.3072, lng:103.8630, lines:["EWL"] },
  { code:"EW12", name:"Bugis",          lat:1.3006, lng:103.8564, lines:["EWL","DTL"] },
  { code:"EW13", name:"City Hall",      lat:1.2931, lng:103.8520, lines:["NSL","EWL"] },
  { code:"EW14", name:"Raffles Place",  lat:1.2840, lng:103.8516, lines:["NSL","EWL"] },
  { code:"EW15", name:"Tanjong Pagar",  lat:1.2764, lng:103.8455, lines:["EWL"] },
  { code:"EW16", name:"Outram Park",    lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"EW17", name:"Tiong Bahru",    lat:1.2864, lng:103.8274, lines:["EWL"] },
  { code:"EW18", name:"Redhill",        lat:1.2895, lng:103.8167, lines:["EWL"] },
  { code:"EW19", name:"Queenstown",     lat:1.2944, lng:103.8060, lines:["EWL"] },
  { code:"EW20", name:"Commonwealth",   lat:1.3022, lng:103.7981, lines:["EWL"] },
  { code:"EW21", name:"Buona Vista",    lat:1.3073, lng:103.7899, lines:["EWL","CCL"] },
  { code:"EW22", name:"Dover",          lat:1.3113, lng:103.7784, lines:["EWL"] },
  { code:"EW23", name:"Clementi",       lat:1.3153, lng:103.7651, lines:["EWL"] },
  { code:"EW24", name:"Jurong East",    lat:1.3332, lng:103.7420, lines:["NSL","EWL"] },
  { code:"EW25", name:"Chinese Garden", lat:1.3423, lng:103.7322, lines:["EWL"] },
  { code:"EW26", name:"Lakeside",       lat:1.3441, lng:103.7207, lines:["EWL"] },
  { code:"EW27", name:"Boon Lay",       lat:1.3388, lng:103.7060, lines:["EWL"] },
  { code:"EW28", name:"Pioneer",        lat:1.3376, lng:103.6972, lines:["EWL"] },
  { code:"EW29", name:"Joo Koon",       lat:1.3278, lng:103.6786, lines:["EWL"] },
  { code:"EW30", name:"Gul Circle",     lat:1.3196, lng:103.6609, lines:["EWL"] },
  { code:"EW31", name:"Tuas Crescent",  lat:1.3208, lng:103.6484, lines:["EWL"] },
  { code:"EW32", name:"Tuas West Road", lat:1.3306, lng:103.6388, lines:["EWL"] },
  { code:"EW33", name:"Tuas Link",      lat:1.3402, lng:103.6368, lines:["EWL"] },

  // NEL — North East Line (#9900AA)
  { code:"NE1",  name:"HarbourFront",   lat:1.2653, lng:103.8218, lines:["NEL","CCL"] },
  { code:"NE3",  name:"Outram Park",    lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"NE4",  name:"Chinatown",      lat:1.2844, lng:103.8444, lines:["NEL","DTL"] },
  { code:"NE5",  name:"Clarke Quay",    lat:1.2883, lng:103.8467, lines:["NEL"] },
  { code:"NE6",  name:"Dhoby Ghaut",    lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"NE7",  name:"Little India",   lat:1.3066, lng:103.8494, lines:["NEL","DTL"] },
  { code:"NE8",  name:"Farrer Park",    lat:1.3121, lng:103.8544, lines:["NEL"] },
  { code:"NE9",  name:"Boon Keng",      lat:1.3198, lng:103.8617, lines:["NEL"] },
  { code:"NE10", name:"Potong Pasir",   lat:1.3316, lng:103.8695, lines:["NEL"] },
  { code:"NE11", name:"Woodleigh",      lat:1.3393, lng:103.8706, lines:["NEL"] },
  { code:"NE12", name:"Serangoon",      lat:1.3499, lng:103.8737, lines:["NEL","CCL"] },
  { code:"NE13", name:"Kovan",          lat:1.3600, lng:103.8852, lines:["NEL"] },
  { code:"NE14", name:"Hougang",        lat:1.3714, lng:103.8924, lines:["NEL"] },
  { code:"NE15", name:"Buangkok",       lat:1.3829, lng:103.8928, lines:["NEL"] },
  { code:"NE16", name:"Sengkang",       lat:1.3916, lng:103.8952, lines:["NEL","LRT"] },
  { code:"NE17", name:"Punggol",        lat:1.4053, lng:103.9022, lines:["NEL","LRT"] },

  // CCL — Circle Line (#FA9E0D)
  { code:"CC1",  name:"Dhoby Ghaut",    lat:1.2990, lng:103.8456, lines:["NSL","NEL","CCL"] },
  { code:"CC2",  name:"Bras Basah",     lat:1.2966, lng:103.8503, lines:["CCL"] },
  { code:"CC3",  name:"Esplanade",      lat:1.2934, lng:103.8555, lines:["CCL"] },
  { code:"CC4",  name:"Promenade",      lat:1.2934, lng:103.8612, lines:["CCL","DTL"] },
  { code:"CC5",  name:"Nicoll Highway", lat:1.2997, lng:103.8635, lines:["CCL"] },
  { code:"CC6",  name:"Stadium",        lat:1.3028, lng:103.8751, lines:["CCL"] },
  { code:"CC7",  name:"Mountbatten",    lat:1.3063, lng:103.8826, lines:["CCL"] },
  { code:"CC8",  name:"Dakota",         lat:1.3086, lng:103.8883, lines:["CCL"] },
  { code:"CC9",  name:"Paya Lebar",     lat:1.3180, lng:103.8922, lines:["EWL","CCL"] },
  { code:"CC10", name:"MacPherson",     lat:1.3267, lng:103.8900, lines:["CCL","DTL"] },
  { code:"CC11", name:"Tai Seng",       lat:1.3355, lng:103.8878, lines:["CCL"] },
  { code:"CC12", name:"Bartley",        lat:1.3424, lng:103.8795, lines:["CCL"] },
  { code:"CC13", name:"Serangoon",      lat:1.3499, lng:103.8737, lines:["NEL","CCL"] },
  { code:"CC14", name:"Lorong Chuan",   lat:1.3526, lng:103.8659, lines:["CCL"] },
  { code:"CC15", name:"Bishan",         lat:1.3510, lng:103.8484, lines:["NSL","CCL"] },
  { code:"CC16", name:"Marymount",      lat:1.3490, lng:103.8396, lines:["CCL"] },
  { code:"CC17", name:"Caldecott",      lat:1.3374, lng:103.8394, lines:["CCL","TEL"] },
  { code:"CC19", name:"Botanic Gardens",lat:1.3223, lng:103.8154, lines:["CCL","DTL"] },
  { code:"CC20", name:"Farrer Road",    lat:1.3172, lng:103.8072, lines:["CCL"] },
  { code:"CC21", name:"Holland Village",lat:1.3118, lng:103.7961, lines:["CCL"] },
  { code:"CC22", name:"Buona Vista",    lat:1.3073, lng:103.7899, lines:["EWL","CCL"] },
  { code:"CC23", name:"one-north",      lat:1.2993, lng:103.7873, lines:["CCL"] },
  { code:"CC24", name:"Kent Ridge",     lat:1.2933, lng:103.7844, lines:["CCL"] },
  { code:"CC25", name:"Haw Par Villa",  lat:1.2826, lng:103.7820, lines:["CCL"] },
  { code:"CC26", name:"Pasir Panjang",  lat:1.2760, lng:103.7918, lines:["CCL"] },
  { code:"CC27", name:"Labrador Park",  lat:1.2723, lng:103.8022, lines:["CCL"] },
  { code:"CC28", name:"Telok Blangah",  lat:1.2706, lng:103.8096, lines:["CCL"] },
  { code:"CC29", name:"HarbourFront",   lat:1.2653, lng:103.8218, lines:["NEL","CCL"] },

  // DTL — Downtown Line (#005EC4)
  { code:"DT1",  name:"Bukit Panjang",  lat:1.3784, lng:103.7761, lines:["DTL"] },
  { code:"DT2",  name:"Cashew",         lat:1.3695, lng:103.7749, lines:["DTL"] },
  { code:"DT3",  name:"Hillview",       lat:1.3620, lng:103.7673, lines:["DTL"] },
  { code:"DT5",  name:"Beauty World",   lat:1.3411, lng:103.7759, lines:["DTL"] },
  { code:"DT6",  name:"King Albert Park",lat:1.3354,lng:103.7832, lines:["DTL"] },
  { code:"DT7",  name:"Sixth Avenue",   lat:1.3309, lng:103.7956, lines:["DTL"] },
  { code:"DT8",  name:"Tan Kah Kee",    lat:1.3257, lng:103.8076, lines:["DTL"] },
  { code:"DT9",  name:"Botanic Gardens",lat:1.3223, lng:103.8154, lines:["CCL","DTL"] },
  { code:"DT10", name:"Stevens",        lat:1.3201, lng:103.8260, lines:["DTL","TEL"] },
  { code:"DT11", name:"Newton",         lat:1.3131, lng:103.8384, lines:["NSL","DTL"] },
  { code:"DT12", name:"Little India",   lat:1.3066, lng:103.8494, lines:["NEL","DTL"] },
  { code:"DT13", name:"Rochor",         lat:1.3038, lng:103.8524, lines:["DTL"] },
  { code:"DT14", name:"Bugis",          lat:1.3006, lng:103.8564, lines:["EWL","DTL"] },
  { code:"DT15", name:"Promenade",      lat:1.2934, lng:103.8612, lines:["CCL","DTL"] },
  { code:"DT16", name:"Bayfront",       lat:1.2822, lng:103.8593, lines:["DTL","CEL"] },
  { code:"DT17", name:"Downtown",       lat:1.2795, lng:103.8529, lines:["DTL"] },
  { code:"DT18", name:"Telok Ayer",     lat:1.2822, lng:103.8481, lines:["DTL"] },
  { code:"DT19", name:"Chinatown",      lat:1.2844, lng:103.8444, lines:["NEL","DTL"] },
  { code:"DT20", name:"Fort Canning",   lat:1.2913, lng:103.8444, lines:["DTL"] },
  { code:"DT21", name:"Bendemeer",      lat:1.3136, lng:103.8630, lines:["DTL"] },
  { code:"DT22", name:"Geylang Bahru",  lat:1.3213, lng:103.8713, lines:["DTL"] },
  { code:"DT23", name:"Mattar",         lat:1.3271, lng:103.8830, lines:["DTL"] },
  { code:"DT24", name:"MacPherson",     lat:1.3267, lng:103.8900, lines:["CCL","DTL"] },
  { code:"DT25", name:"Ubi",            lat:1.3298, lng:103.8997, lines:["DTL"] },
  { code:"DT26", name:"Kaki Bukit",     lat:1.3352, lng:103.9091, lines:["DTL"] },
  { code:"DT27", name:"Bedok North",    lat:1.3340, lng:103.9194, lines:["DTL"] },
  { code:"DT28", name:"Bedok Reservoir",lat:1.3363, lng:103.9324, lines:["DTL"] },
  { code:"DT29", name:"Tampines West",  lat:1.3454, lng:103.9383, lines:["DTL"] },
  { code:"DT30", name:"Tampines",       lat:1.3529, lng:103.9454, lines:["EWL","DTL"] },
  { code:"DT31", name:"Tampines East",  lat:1.3563, lng:103.9533, lines:["DTL"] },
  { code:"DT32", name:"Upper Changi",   lat:1.3413, lng:103.9614, lines:["DTL"] },
  { code:"DT33", name:"Expo",           lat:1.3353, lng:103.9614, lines:["DTL","CGL"] },
  { code:"DT35", name:"Xilin",          lat:1.3249, lng:103.9609, lines:["DTL"] },
  { code:"DT36", name:"Sungei Bedok",   lat:1.3179, lng:103.9607, lines:["DTL","TEL"] },

  // TEL — Thomson East Coast Line (#9D5918)
  { code:"TE1",  name:"Woodlands North",lat:1.4481, lng:103.7983, lines:["TEL"] },
  { code:"TE2",  name:"Woodlands",      lat:1.4371, lng:103.7865, lines:["NSL","TEL"] },
  { code:"TE3",  name:"Woodlands South",lat:1.4272, lng:103.7939, lines:["TEL"] },
  { code:"TE4",  name:"Springleaf",     lat:1.3981, lng:103.8187, lines:["TEL"] },
  { code:"TE5",  name:"Lentor",         lat:1.3846, lng:103.8368, lines:["TEL"] },
  { code:"TE6",  name:"Mayflower",      lat:1.3724, lng:103.8372, lines:["TEL"] },
  { code:"TE7",  name:"Bright Hill",    lat:1.3638, lng:103.8347, lines:["TEL"] },
  { code:"TE8",  name:"Upper Thomson",  lat:1.3542, lng:103.8329, lines:["TEL"] },
  { code:"TE9",  name:"Caldecott",      lat:1.3374, lng:103.8396, lines:["CCL","TEL"] },
  { code:"TE11", name:"Stevens",        lat:1.3201, lng:103.8260, lines:["DTL","TEL"] },
  { code:"TE12", name:"Napier",         lat:1.3066, lng:103.8187, lines:["TEL"] },
  { code:"TE13", name:"Orchard Blvd",   lat:1.3036, lng:103.8255, lines:["TEL"] },
  { code:"TE14", name:"Orchard",        lat:1.3040, lng:103.8318, lines:["NSL","TEL"] },
  { code:"TE15", name:"Great World",    lat:1.2944, lng:103.8355, lines:["TEL"] },
  { code:"TE16", name:"Havelock",       lat:1.2887, lng:103.8390, lines:["TEL"] },
  { code:"TE17", name:"Outram Park",    lat:1.2803, lng:103.8394, lines:["EWL","NEL","TEL"] },
  { code:"TE18", name:"Maxwell",        lat:1.2791, lng:103.8448, lines:["TEL"] },
  { code:"TE19", name:"Shenton Way",    lat:1.2769, lng:103.8491, lines:["TEL"] },
  { code:"TE20", name:"Marina Bay",     lat:1.2764, lng:103.8546, lines:["NSL","CEL","TEL"] },
  { code:"TE22", name:"Gardens by the Bay",lat:1.2816,lng:103.8637,lines:["TEL"] },
  { code:"TE23", name:"Tanjong Rhu",    lat:1.2967, lng:103.8737, lines:["TEL"] },
  { code:"TE24", name:"Katong Park",    lat:1.3021, lng:103.8818, lines:["TEL"] },
  { code:"TE25", name:"Tanjong Katong", lat:1.3046, lng:103.8925, lines:["TEL"] },
  { code:"TE26", name:"Marine Parade",  lat:1.3025, lng:103.9050, lines:["TEL"] },
  { code:"TE27", name:"Marine Terrace", lat:1.3086, lng:103.9133, lines:["TEL"] },
  { code:"TE28", name:"Siglap",         lat:1.3125, lng:103.9267, lines:["TEL"] },
  { code:"TE29", name:"Bayshore",       lat:1.3184, lng:103.9373, lines:["TEL"] },
  { code:"TE30", name:"Bedok South",    lat:1.3204, lng:103.9468, lines:["TEL"] },
  { code:"TE31", name:"Sungei Bedok",   lat:1.3179, lng:103.9607, lines:["DTL","TEL"] },
];

// Deduplicate by name for nearest-station lookup (keep first occurrence)
const UNIQUE_STATIONS = STATIONS.reduce((acc, s) => {
  if (!acc.find(x => x.name === s.name)) acc.push(s);
  return acc;
}, []);

// Coordinates are hardcoded from Wikipedia/LTA verified sources — no dynamic fetching needed.

// Line metadata
const LINE_META = {
  NSL: { label:"North–South Line", color:"#D42E12", short:"NSL" },
  EWL: { label:"East–West Line",   color:"#009645", short:"EWL" },
  NEL: { label:"North East Line",  color:"#9900AA", short:"NEL" },
  CCL: { label:"Circle Line",      color:"#FA9E0D", short:"CCL" },
  DTL: { label:"Downtown Line",    color:"#005EC4", short:"DTL" },
  TEL: { label:"Thomson–East Coast Line", color:"#9D5918", short:"TEL" },
};

// ─── ROUTING ─────────────────────────────────────────────────────────────────
// Sequential line order — stations must be neighbours to be connected.
// Each array is the ordered stop sequence for that line.
const LINE_SEQUENCES = {
  NSL: ["NS1","NS2","NS3","NS4","NS5","NS7","NS8","NS9","NS10","NS11","NS12","NS13","NS14","NS15","NS16","NS17","NS18","NS19","NS20","NS21","NS22","NS23","NS24","NS25","NS26","NS27","NS28"],
  EWL: ["EW33","EW32","EW31","EW30","EW29","EW28","EW27","EW26","EW25","EW24","EW23","EW22","EW21","EW20","EW19","EW18","EW17","EW16","EW15","EW14","EW13","EW12","EW11","EW10","EW9","EW8","EW7","EW6","EW5","EW4","EW3","EW2","EW1"],
  NEL: ["NE1","NE3","NE4","NE5","NE6","NE7","NE8","NE9","NE10","NE11","NE12","NE13","NE14","NE15","NE16","NE17"],
  CCL: ["CC1","CC2","CC3","CC4","CC5","CC6","CC7","CC8","CC9","CC10","CC11","CC12","CC13","CC14","CC15","CC16","CC17","CC19","CC20","CC21","CC22","CC23","CC24","CC25","CC26","CC27","CC28","CC29"],
  DTL: ["DT1","DT2","DT3","DT5","DT6","DT7","DT8","DT9","DT10","DT11","DT12","DT13","DT14","DT15","DT16","DT17","DT18","DT19","DT20","DT21","DT22","DT23","DT24","DT25","DT26","DT27","DT28","DT29","DT30","DT31","DT32","DT33","DT35","DT36"],
  TEL: ["TE1","TE2","TE3","TE4","TE5","TE6","TE7","TE8","TE9","TE11","TE12","TE13","TE14","TE15","TE16","TE17","TE18","TE19","TE20","TE22","TE23","TE24","TE25","TE26","TE27","TE28","TE29","TE30","TE31"],
};

// Build adjacency: only SEQUENTIAL neighbours on each line are connected.
// Interchange stations are also connected to their counterpart codes
// (e.g. NS25 City Hall ↔ EW13 City Hall) so transfers work.
function buildGraph() {
  const adj = {};
  const allCodes = STATIONS.map(s => s.code);
  allCodes.forEach(c => { adj[c] = new Set(); });

  // 1. Sequential neighbours within each line
  Object.values(LINE_SEQUENCES).forEach(seq => {
    for (let i = 0; i < seq.length - 1; i++) {
      const a = seq[i], b = seq[i + 1];
      if (adj[a] && adj[b]) { adj[a].add(b); adj[b].add(a); }
    }
  });

  // 2. Interchange links: stations with the same name but different codes
  const byName = {};
  STATIONS.forEach(s => { (byName[s.name] = byName[s.name] || []).push(s.code); });
  Object.values(byName).forEach(codes => {
    if (codes.length < 2) return;
    codes.forEach(a => codes.forEach(b => { if (a !== b && adj[a] && adj[b]) { adj[a].add(b); adj[b].add(a); } }));
  });

  return adj;
}

const GRAPH = buildGraph();

// BFS — fewest stops (existing)
function findPath(fromName, toName) {
  const fromCodes = STATIONS.filter(s => s.name === fromName).map(s => s.code);
  const toCodes   = new Set(STATIONS.filter(s => s.name === toName).map(s => s.code));
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

// Dijkstra — fewest transfers (minimise line changes, use stop count as tiebreaker)
function findPathFewestTransfers(fromName, toName) {
  const fromCodes = STATIONS.filter(s => s.name === fromName).map(s => s.code);
  const toCodes   = new Set(STATIONS.filter(s => s.name === toName).map(s => s.code));
  if (!fromCodes.length || !toCodes.size) return null;

  function getLine(code) {
    const s = STATIONS.find(st => st.code === code);
    // Return the primary line for this code based on LINE_SEQUENCES
    for (const [line, seq] of Object.entries(LINE_SEQUENCES)) {
      if (seq.includes(code)) return line;
    }
    return s?.lines[0] || null;
  }

  // State: { code, transfers, stops, path, currentLine }
  // Priority: transfers first, then stops
  const queue = fromCodes.map(c => ({ code: c, transfers: 0, stops: 0, path: [c], currentLine: getLine(c) }));
  // visited key = code + currentLine to allow revisit via different lines
  const best = {}; // code+line → {transfers, stops}
  const key = (c, l) => `${c}|${l}`;

  queue.forEach(s => { best[key(s.code, s.currentLine)] = { transfers: 0, stops: 0 }; });
  queue.sort((a, b) => a.transfers - b.transfers || a.stops - b.stops);

  while (queue.length) {
    queue.sort((a, b) => a.transfers - b.transfers || a.stops - b.stops);
    const cur = queue.shift();

    if (toCodes.has(cur.code)) return cur.path;

    for (const nb of (GRAPH[cur.code] || [])) {
      const nbLine = getLine(nb);
      const nbSt = STATIONS.find(s => s.code === nb);
      const curSt = STATIONS.find(s => s.code === cur.code);
      // Interchange node (same name, different code) counts as a transfer
      const isInterchange = curSt && nbSt && curSt.name === nbSt.name;
      const newTransfers = cur.transfers + (isInterchange ? 1 : 0);
      const newStops = cur.stops + 1;
      const k = key(nb, nbLine);

      if (!best[k] || newTransfers < best[k].transfers || (newTransfers === best[k].transfers && newStops < best[k].stops)) {
        best[k] = { transfers: newTransfers, stops: newStops };
        queue.push({ code: nb, transfers: newTransfers, stops: newStops, path: [...cur.path, nb], currentLine: nbLine });
      }
    }
  }
  return null;
}

// Convert a code-path → legs grouped by line
function pathToLegs(codePath) {
  if (!codePath || codePath.length < 2) return [];

  // Returns the shared line between two adjacent codes.
  // Returns null for same-name interchange nodes (NS21↔DT11) — signals a leg break.
  function sharedLine(codeA, codeB) {
    const sa = STATIONS.find(s => s.code === codeA);
    const sb = STATIONS.find(s => s.code === codeB);
    if (!sa || !sb) return null;
    // Same station name but different codes = interchange transfer node.
    // Return null so pathToLegs treats this as a leg boundary.
    if (sa.name === sb.name) return null;
    return sa.lines.find(l => sb.lines.includes(l)) || null;
  }

  const legs = [];
  let legLine = sharedLine(codePath[0], codePath[1]);
  // If first hop is already an interchange, use the starting station's primary line
  if (!legLine) {
    const s = STATIONS.find(st => st.code === codePath[0]);
    legLine = s?.lines[0] || null;
  }
  let legCodes = [codePath[0]];

  for (let i = 1; i < codePath.length; i++) {
    const cur = codePath[i];
    const nextLine = i < codePath.length - 1 ? sharedLine(cur, codePath[i + 1]) : null;
    const curStation = STATIONS.find(s => s.code === cur);
    const prevStation = STATIONS.find(s => s.code === codePath[i - 1]);

    // Detect interchange: same name, different code → skip the duplicate node,
    // end the current leg at the PREVIOUS stop (the transfer point), start new leg
    const isInterchangeNode = curStation && prevStation && curStation.name === prevStation.name;

    if (isInterchangeNode) {
      // Close the previous leg at prevStation (already in legCodes)
      const stops = legCodes.map(c => {
        const s = STATIONS.find(st => st.code === c);
        return s ? { ...s } : { name: c, code: c, lat: 0, lng: 0 };
      });
      if (stops.length > 0) legs.push({ line: legLine, stops });
      // Start fresh leg from the new-code version of this interchange station
      legLine = nextLine || curStation?.lines.find(l => l !== prevStation?.lines[0]) || curStation?.lines[0];
      legCodes = [cur];
    } else {
      legCodes.push(cur);
      const lineChange = nextLine && nextLine !== legLine;
      if (lineChange || i === codePath.length - 1) {
        const stops = legCodes.map(c => {
          const s = STATIONS.find(st => st.code === c);
          return s ? { ...s } : { name: c, code: c, lat: 0, lng: 0 };
        });
        legs.push({ line: legLine, stops });
        if (lineChange) { legLine = nextLine; legCodes = [cur]; }
      }
    }
  }

  return legs.filter(leg => leg.stops.length >= 1);
}

// Build alerts array from legs
function buildAlerts(legs) {
  const alerts = [];
  legs.forEach((leg, i) => {
    const isLast = i === legs.length - 1;
    const lastStop = leg.stops[leg.stops.length - 1];
    if (!isLast) {
      alerts.push({ id: `transfer-${lastStop.code}`, type: "transfer", stopCode: lastStop.code, stopName: lastStop.name, radiusM: 600, message: "Get ready to transfer", detail: `Board ${LINE_META[legs[i + 1].line]?.label || legs[i + 1].line} at ${lastStop.name}`, color: "#F59E0B", vibratePattern: [200, 100, 200], lat: lastStop.lat, lng: lastStop.lng });
    } else {
      alerts.push({ id: `alight-${lastStop.code}`, type: "alight", stopCode: lastStop.code, stopName: lastStop.name, radiusM: 400, message: "Alight now!", detail: `${lastStop.name} MRT`, color: "#009645", vibratePattern: [300, 100, 300, 100, 600], lat: lastStop.lat, lng: lastStop.lng });
    }
  });
  return alerts;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestStation(lat, lng) {
  return UNIQUE_STATIONS.reduce((best, s) => {
    const d = haversineM(lat, lng, s.lat, s.lng);
    return d < best.d ? { s, d } : best;
  }, { s: null, d: Infinity }).s;
}

function vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

// OneMap geocode — called directly from browser (CORS is open on their API)
async function geocodePostal(postal) {
  const res = await fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
  if (!res.ok) throw new Error("Postal code not found");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("Postal code not found");
  const r = data.results[0];
  return { lat: parseFloat(r.LATITUDE), lng: parseFloat(r.LONGITUDE), address: r.ADDRESS };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function LinePill({ line, small }) {
  const m = LINE_META[line] || { color: "#666", short: line };
  return <span style={{ background: m.color, color: "#fff", fontWeight: 800, fontSize: small ? 10 : 11, borderRadius: 5, padding: small ? "1px 6px" : "2px 8px", flexShrink: 0, letterSpacing: "0.03em" }}>{m.short}</span>;
}

function StopDot({ color, passed, active, isAlert, isTransfer }) {
  const size = isAlert ? 13 : 9;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: passed || active ? color : "transparent", border: `2px solid ${isAlert ? color : passed ? color : "#1E2D40"}`, boxShadow: active ? `0 0 10px ${color}` : "none", transition: "all .3s" }} />
  );
}

function StopRow({ stop, color, isFirst, isLast, isTransferAlert, isAlightAlert, passed, active }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", minHeight: (isTransferAlert || isAlightAlert) ? 42 : 32 }}>
      <div style={{ width: 26, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 2, flex: isFirst ? 0 : 1, background: color, opacity: passed ? 1 : 0.18 }} />
        <StopDot color={color} passed={passed} active={active} isAlert={isTransferAlert || isAlightAlert} />
        <div style={{ width: 2, flex: isLast ? 0 : 1, background: color, opacity: passed ? 1 : 0.18 }} />
      </div>
      <div style={{ paddingLeft: 9, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 2 }}>
        <span style={{ color: isAlightAlert ? "#fff" : isTransferAlert ? "#FCD34D" : passed ? "#2D3748" : "#4B5563", fontSize: (isTransferAlert || isAlightAlert) ? 13 : 12, fontWeight: (isTransferAlert || isAlightAlert) ? 700 : 400, textDecoration: passed && !isTransferAlert && !isAlightAlert ? "line-through" : "none", transition: "color .3s" }}>
          {stop.name}
        </span>
        {isTransferAlert && <span style={{ color: "#92400E", fontSize: 10, fontWeight: 600 }}>⇄ transfer here</span>}
        {isAlightAlert && <span style={{ color: "#059669", fontSize: 10, fontWeight: 600 }}>↓ alight here</span>}
      </div>
    </div>
  );
}

function AlertBanner({ alert, onMissed, onTransferred }) {
  return (
    <div style={{ background: alert.type === "alight" ? "#052e16" : "#1c1400", border: `1.5px solid ${alert.color}`, borderRadius: 14, padding: "14px 14px", animation: "pulse2 .9s ease infinite" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ color: alert.color, fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{alert.type === "alight" ? "🔔" : "⇄"} {alert.message}</div>
          <div style={{ color: "#6B7280", fontSize: 12 }}>{alert.detail}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {alert.type === "transfer" && (
            <button onClick={onTransferred} style={{ background: "#14532d", border: "1px solid #16a34a", color: "#4ade80", fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "6px 10px", cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}>
              Transferred ✓
            </button>
          )}
          <button onClick={onMissed} style={{ background: "#1E2D40", border: "none", color: "#94A3B8", fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "6px 10px", cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}>
            I missed<br />my stop
          </button>
        </div>
      </div>
    </div>
  );
}

function MissedPanel({ alerts, firedCount, onDismiss }) {
  const lastFired = alerts[firedCount - 1];
  const isTransfer = lastFired?.type === "transfer";
  const nextAlert = alerts[firedCount];
  return (
    <div style={{ background: "#1a0a00", border: "1.5px solid #DC2626", borderRadius: 14, padding: 14 }}>
      <div style={{ color: "#EF4444", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>😬 Missed {isTransfer ? "the transfer" : "your stop"}</div>
      {isTransfer && nextAlert ? (
        <div style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Stay on. Take the next train to <b style={{ color: "#fff" }}>{nextAlert.stopName}</b> then board <b style={{ color: "#fff" }}>{LINE_META[alerts[firedCount]?.line]?.short || "the next line"}</b> back.
        </div>
      ) : (
        <div style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Ride one more stop, alight, and take the next train back to <b style={{ color: "#fff" }}>{lastFired?.stopName}</b>.
        </div>
      )}
      <button onClick={onDismiss} style={{ width: "100%", padding: "9px", borderRadius: 9, border: "1px solid #374151", background: "transparent", color: "#94A3B8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        Got it — keep tracking
      </button>
    </div>
  );
}

// ─── POSTAL INPUT ─────────────────────────────────────────────────────────────
function PostalInput({ label, value, onChange, status, station }) {
  const color = status === "ok" ? "#009645" : status === "error" ? "#DC2626" : status === "loading" ? "#F59E0B" : "#1E2D40";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: "#374151", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ background: "#161B27", borderRadius: 14, border: `1.5px solid ${color}`, transition: "border-color .2s", padding: "0 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>{status === "ok" ? "✅" : status === "loading" ? "⏳" : status === "error" ? "❌" : "📍"}</span>
        <input
          type="tel" inputMode="numeric" maxLength={6} placeholder="e.g. 759775"
          value={value} onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 20, fontWeight: 600, padding: "14px 0", fontFamily: "DM Mono, monospace", letterSpacing: ".1em" }}
        />
      </div>
      {station && <div style={{ color: "#009645", fontSize: 12, marginTop: 5, paddingLeft: 4 }}>→ Nearest: <b>{station.name}</b></div>}
      {status === "error" && <div style={{ color: "#DC2626", fontSize: 12, marginTop: 5, paddingLeft: 4 }}>Postal code not found</div>}
    </div>
  );
}

// ─── STATION PICKER ───────────────────────────────────────────────────────────
const LINE_ORDER = ["NSL","EWL","NEL","CCL","DTL","TEL"];

function StationPicker({ label, value, onChange }) {
  const [query, setQuery] = useState("");
  const [lineFilter, setLineFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const filtered = UNIQUE_STATIONS.filter(s => {
    const matchName = s.name.toLowerCase().includes(query.toLowerCase());
    const matchLine = lineFilter ? s.lines.includes(lineFilter) : true;
    return matchName && matchLine;
  }).slice(0, 40);

  function select(st) {
    onChange(st);
    setOpen(false);
    setQuery("");
    setLineFilter(null);
  }

  return (
    <div style={{ marginBottom: 12, position: "relative" }}>
      <div style={{ color: "#374151", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>

      {/* Selected station display / tap to open */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        style={{ width: "100%", background: "#161B27", borderRadius: 14, border: `1.5px solid ${value ? "#009645" : "#1E2D40"}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left", transition: "border-color .2s" }}
      >
        <span style={{ fontSize: 16 }}>{value ? "✅" : "🚉"}</span>
        {value ? (
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{value.name}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
              {value.lines.filter(l => LINE_META[l]).map(l => <LinePill key={l} line={l} small />)}
            </div>
          </div>
        ) : (
          <span style={{ color: "#374151", fontSize: 14, flex: 1 }}>Select a station…</span>
        )}
        <span style={{ color: "#374151", fontSize: 12 }}>▾</span>
      </button>

      {/* Dropdown overlay */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(8,12,20,.92)",
          display: "flex", flexDirection: "column",
          animation: "fadeUp .2s ease",
        }}>
          <div style={{ background: "#0D1117", borderBottom: "1px solid #1E2D40", padding: "16px 20px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <button onClick={() => { setOpen(false); setQuery(""); setLineFilter(null); }} style={{ background: "#161B27", border: "none", color: "#6B7280", width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
              <div style={{ flex: 1, background: "#161B27", borderRadius: 12, border: "1px solid #1E2D40", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
                <span style={{ color: "#374151", fontSize: 14 }}>🔍</span>
                <input
                  ref={inputRef}
                  placeholder={`Search ${label.toLowerCase()}…`}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 15, padding: "12px 0", fontFamily: "inherit" }}
                />
                {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>}
              </div>
            </div>
            {/* Line filter pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              <button
                onClick={() => setLineFilter(null)}
                style={{ background: lineFilter === null ? "#fff" : "#161B27", border: "1px solid #1E2D40", borderRadius: 8, padding: "4px 12px", color: lineFilter === null ? "#000" : "#6B7280", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
              >All</button>
              {LINE_ORDER.map(l => {
                const m = LINE_META[l];
                const active = lineFilter === l;
                return (
                  <button key={l} onClick={() => setLineFilter(active ? null : l)} style={{ background: active ? m.color : "#161B27", border: `1px solid ${active ? m.color : "#1E2D40"}`, borderRadius: 8, padding: "4px 12px", color: active ? "#fff" : "#6B7280", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}>
                    {m.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {filtered.length === 0 && (
              <div style={{ color: "#374151", fontSize: 14, textAlign: "center", padding: "32px 20px" }}>No stations found</div>
            )}
            {filtered.map(st => (
              <button key={st.code} onClick={() => select(st)} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", borderBottom: "1px solid #0D1117" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{st.name}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                    {st.lines.filter(l => LINE_META[l]).map(l => <LinePill key={l} line={l} small />)}
                  </div>
                </div>
                <span style={{ color: "#374151", fontSize: 12 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────
const S = { INPUT: 0, CONFIRM: 1, TRACKING: 2, DONE: 3 };

export default function App() {
  const [screen, setScreen] = useState(S.INPUT);
  const [inputMode, setInputMode] = useState("station"); // "station" | "postal"
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [fromStatus, setFromStatus] = useState("idle");
  const [toStatus, setToStatus] = useState("idle");
  const [fromStation, setFromStation] = useState(null);
  const [toStation, setToStation] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeMode, setRouteMode] = useState("fastest"); // "fastest" | "least-transfers"
  const [routeError, setRouteError] = useState(null);

  const [gpsStatus, setGpsStatus] = useState("idle");
  const [distanceM, setDistanceM] = useState(null);
  const [currentPos, setCurrentPos] = useState(null); // {lat, lng} live position
  const [activeAlertIdx, setActiveAlertIdx] = useState(null);
  const [showMissed, setShowMissed] = useState(false);
  const [nearMeDebug, setNearMeDebug] = useState(null);
  const [passedStopIdx, setPassedStopIdx] = useState(-1);
  const [simProgress, setSimProgress] = useState(0);
  const [useSimMode, setUseSimMode] = useState(false);

  const watchRef = useRef(null);
  const simRef = useRef(null);
  const firedRef = useRef(new Set());
  const simProgressRef = useRef(0);
  const debounceRef = useRef({});

  // ── Geocode on postal input with debounce
  function handlePostal(side, val) {
    if (side === "from") { setFromPostal(val); setFromStation(null); setFromStatus(val.length === 6 ? "loading" : "idle"); }
    else { setToPostal(val); setToStation(null); setToStatus(val.length === 6 ? "loading" : "idle"); }
    if (val.length !== 6) return;
    clearTimeout(debounceRef.current[side]);
    debounceRef.current[side] = setTimeout(async () => {
      try {
        const { lat, lng } = await geocodePostal(val);
        const st = nearestStation(lat, lng);
        if (side === "from") { setFromStation(st); setFromStatus("ok"); }
        else { setToStation(st); setToStatus("ok"); }
      } catch {
        if (side === "from") setFromStatus("error");
        else setToStatus("error");
      }
    }, 600);
  }

  function buildRoute(mode) {
    const m = mode || routeMode;
    if (!fromStation || !toStation) return;
    if (fromStation.name === toStation.name) { setRouteError("Origin and destination are the same station."); return; }
    const codePath = m === "least-transfers"
      ? findPathFewestTransfers(fromStation.name, toStation.name)
      : findPath(fromStation.name, toStation.name);
    if (!codePath) { setRouteError("No route found between these stations."); return; }
    const legs = pathToLegs(codePath);
    if (!legs.length) { setRouteError("Could not build route legs. Try a different pair."); return; }
    const alerts = buildAlerts(legs);
    const uniqueNames = [...new Set(codePath.map(c => STATIONS.find(s => s.code === c)?.name))];
    const transfers = legs.length - 1;
    setRoute({ legs, alerts, codePath, stopCount: uniqueNames.length - 1, transfers, mode: m });
    setRouteError(null);
    setScreen(S.CONFIRM);
  }

  // ── GPS / Sim logic
  function processPosition(lat, lng) {
    if (!route) return;
    setCurrentPos({ lat, lng });
    // Update progress: find closest stop, then check if we're closer to the NEXT
    // stop than the current one — if so, we've passed the current stop.
    const allStops = route.legs.flatMap(l => l.stops);
    setPassedStopIdx(prev => {
      // Start from where we already are
      const searchFrom = Math.max(0, prev);
      let newIdx = prev;
      for (let i = searchFrom; i < allStops.length - 1; i++) {
        const dCurrent = haversineM(lat, lng, allStops[i].lat, allStops[i].lng);
        const dNext    = haversineM(lat, lng, allStops[i + 1].lat, allStops[i + 1].lng);
        if (dNext < dCurrent) {
          // Closer to next stop than current — we've passed stop i
          newIdx = i + 1;
        } else {
          break; // Still approaching stop i, stop scanning
        }
      }
      return newIdx;
    });
    const nextAlert = route.alerts.find(a => !firedRef.current.has(a.id));
    if (!nextAlert) return;
    const d = haversineM(lat, lng, nextAlert.lat, nextAlert.lng);
    setDistanceM(Math.round(d));
    if (d <= nextAlert.radiusM) {
      firedRef.current.add(nextAlert.id);
      vibrate(nextAlert.vibratePattern);
      const idx = route.alerts.findIndex(a => a.id === nextAlert.id);
      setActiveAlertIdx(idx);
      setShowMissed(false);
      if (nextAlert.type === "alight") setTimeout(() => setScreen(S.DONE), 3000);
    }
  }

  function startGPS() {
    setGpsStatus("requesting");
    if (!navigator.geolocation) { setGpsStatus("denied"); return; }
    watchRef.current = navigator.geolocation.watchPosition(
      pos => { setGpsStatus("ok"); processPosition(pos.coords.latitude, pos.coords.longitude); },
      () => setGpsStatus("denied"),
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 20000 }
    );
  }

  function startSim() {
    if (!route) return;
    setUseSimMode(true); setGpsStatus("simulating");
    setSimProgress(0); simProgressRef.current = 0;
    firedRef.current = new Set(); setActiveAlertIdx(null); setShowMissed(false);

    // Build ordered waypoints from actual stop coordinates in the route
    // This ensures the sim visits Newton, Bugis etc. at their real positions
    const waypoints = route.legs
      .flatMap(leg => leg.stops)
      .filter((s, i, arr) => arr.findIndex(x => x.code === s.code) === i)
      .filter(s => s.lat && s.lng);

    if (waypoints.length < 2) return;

    const totalStops = waypoints.length;
    let stopIdx = 0;       // which segment we're currently traversing
    let segProgress = 0;   // 0→1 within the current segment

    let unmounted = false;
    simRef.current = setInterval(() => {
      if (unmounted) { clearInterval(simRef.current); return; }
      segProgress += 0.06; // speed within each segment

      if (segProgress >= 1) {
        segProgress = 0;
        stopIdx = Math.min(stopIdx + 1, totalStops - 2);
      }

      const from = waypoints[stopIdx];
      const to   = waypoints[stopIdx + 1];
      const lat  = from.lat + (to.lat - from.lat) * segProgress;
      const lng  = from.lng + (to.lng - from.lng) * segProgress;

      // Overall progress for the progress bar
      const overall = (stopIdx + segProgress) / (totalStops - 1);
      setSimProgress(overall);
      simProgressRef.current = overall;

      processPosition(lat, lng);

      if (stopIdx >= totalStops - 2 && segProgress >= 0.99) {
        clearInterval(simRef.current);
      }
    }, 120);
    return () => { unmounted = true; clearInterval(simRef.current); };
  }

  function stopTracking() {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    if (simRef.current) clearInterval(simRef.current);
  }

  function reset() {
    stopTracking(); firedRef.current = new Set();
    setScreen(S.INPUT); setFromPostal(""); setToPostal("");
    setFromStatus("idle"); setToStatus("idle");
    setFromStation(null); setToStation(null); setRoute(null); setRouteError(null);
    setGpsStatus("idle"); setDistanceM(null); setCurrentPos(null);
    setActiveAlertIdx(null); setShowMissed(false);
    setSimProgress(0); setUseSimMode(false); simProgressRef.current = 0;
  }

  useEffect(() => () => stopTracking(), []);

  const canBuildRoute = inputMode === "station"
    ? (fromStation && toStation)
    : (fromStatus === "ok" && toStatus === "ok" && fromStation && toStation);
  const activeAlert = route && activeAlertIdx !== null ? route.alerts[activeAlertIdx] : null;
  const nextUnfiredAlert = route ? route.alerts.find(a => !firedRef.current.has(a.id)) : null;
  const allStopsFlat = route ? route.legs.flatMap(l => l.stops) : [];
  const simStopIdx = useSimMode ? Math.min(Math.floor(simProgress * allStopsFlat.length), allStopsFlat.length - 1) : -1;

  return (
    <div style={{ minHeight: "100vh", background: "#080C14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', -apple-system, sans-serif", padding: 20 }}>
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

      <div style={{ width: "100%", maxWidth: 390, minHeight: 780, background: "#0D1117", borderRadius: 50, overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.07)", display: "flex", flexDirection: "column" }}>

        {/* Status bar */}
        <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "DM Mono" }}>9:41</span>
          <div style={{ width: 126, height: 34, background: "#000", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)" }} />
          <span style={{ color: "#fff", fontSize: 13, opacity: .7 }}>●●● ▲</span>
        </div>

        {/* ── INPUT ── */}
        {screen === S.INPUT && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 22px 32px", animation: "fadeUp .5s ease" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, background: "#D42E12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14, boxShadow: "0 8px 24px rgba(212,46,18,.4)" }}>🚇</div>
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-.5px" }}>SG Transit Alert</h1>
              <p style={{ color: "#374151", fontSize: 13, margin: 0 }}>Wake me up at my stop.</p>
            </div>

            {/* Mode tabs */}
            <div style={{ display: "flex", background: "#161B27", borderRadius: 12, padding: 4, marginBottom: 18, border: "1px solid #1E2D40" }}>
              {[["station", "🚉 By Station"], ["postal", "📮 By Postal Code"]].map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => { setInputMode(mode); setFromStation(null); setToStation(null); setFromPostal(""); setToPostal(""); setFromStatus("idle"); setToStatus("idle"); setRouteError(null); }}
                  style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: "none", background: inputMode === mode ? "#0D1117" : "transparent", color: inputMode === mode ? "#fff" : "#4B5563", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s", boxShadow: inputMode === mode ? "0 2px 8px rgba(0,0,0,.4)" : "none" }}
                >{label}</button>
              ))}
            </div>

            {/* Station picker mode */}
            {inputMode === "station" && (
              <>
                <div style={{ position: "relative" }}>
                  <StationPicker label="From" value={fromStation} onChange={st => { setFromStation(st); setRouteError(null); }} />
                  <button
                    onClick={() => {
                      if (!navigator.geolocation) return;
                      navigator.geolocation.getCurrentPosition(pos => {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        const nearest = UNIQUE_STATIONS.reduce((best, s) => {
                          const d = haversineM(lat, lng, s.lat, s.lng);
                          return d < best.d ? { s, d } : best;
                        }, { s: null, d: Infinity }).s;
                        setNearMeDebug(`GPS: ${lat.toFixed(4)},${lng.toFixed(4)} → ${nearest?.name ?? "none"} (${nearest ? Math.round(haversineM(lat, lng, nearest.lat, nearest.lng)) : "?"}m)`);
                        if (nearest) { setFromStation(nearest); setRouteError(null); }
                      }, null, { enableHighAccuracy: true, timeout: 8000 });
                    }}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#1E2D40", border: "1px solid #2D3F55", borderRadius: 8, color: "#60A5FA", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer" }}
                  >
                    📍 Near me
                  </button>
                </div>
                {nearMeDebug && <div style={{ color: "#6B7280", fontSize: 10, fontFamily: "DM Mono", padding: "4px 2px", wordBreak: "break-all" }}>{nearMeDebug}</div>}
                <StationPicker label="To" value={toStation} onChange={st => { setToStation(st); setRouteError(null); }} />

                {/* Quick examples */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#374151", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>Quick picks</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[
                      { label: "Sembawang → Lavender", from: "Sembawang", to: "Lavender" },
                      { label: "Orchard → Bugis", from: "Orchard", to: "Bugis" },
                      { label: "Jurong East → Expo", from: "Jurong East", to: "Expo" },
                    ].map((eg, i) => (
                      <button key={i} onClick={() => {
                        const f = UNIQUE_STATIONS.find(s => s.name === eg.from);
                        const t = UNIQUE_STATIONS.find(s => s.name === eg.to);
                        if (f) setFromStation(f);
                        if (t) setToStation(t);
                        setRouteError(null);
                      }} style={{ background: "#161B27", border: "1px solid #1E2D40", borderRadius: 10, padding: "6px 12px", color: "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                        {eg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Postal code mode */}
            {inputMode === "postal" && (
              <>
                <div style={{ position: "relative" }}>
                  <PostalInput label="From (postal code)" value={fromPostal} onChange={v => handlePostal("from", v)} status={fromStatus} station={fromStation} />
                  <button
                    onClick={() => {
                      if (!navigator.geolocation) return;
                      navigator.geolocation.getCurrentPosition(pos => {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        const nearest = UNIQUE_STATIONS.reduce((best, s) => {
                          const d = haversineM(lat, lng, s.lat, s.lng);
                          return d < best.d ? { s, d } : best;
                        }, { s: null, d: Infinity }).s;
                        if (nearest) { setFromStation(nearest); setFromStatus("ok"); setRouteError(null); }
                      }, null, { enableHighAccuracy: true, timeout: 8000 });
                    }}
                    style={{ position: "absolute", right: 10, top: 18, background: "#1E2D40", border: "1px solid #2D3F55", borderRadius: 8, color: "#60A5FA", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer" }}
                  >
                    📍 Near me
                  </button>
                </div>
                <PostalInput label="To (postal code)" value={toPostal} onChange={v => handlePostal("to", v)} status={toStatus} station={toStation} />
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#374151", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>Try these</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[
                      { label: "Sembawang → Lavender", from: "759775", to: "208699" },
                      { label: "Jurong East → Changi", from: "609731", to: "498949" },
                      { label: "Woodlands → Marina Bay", from: "738567", to: "018980" },
                    ].map((eg, i) => (
                      <button key={i} onClick={() => { handlePostal("from", eg.from); handlePostal("to", eg.to); }} style={{ background: "#161B27", border: "1px solid #1E2D40", borderRadius: 10, padding: "6px 12px", color: "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                        {eg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {routeError && <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 10, paddingLeft: 4 }}>{routeError}</div>}

            <div style={{ marginTop: "auto" }}>
              {/* Bus routes coming soon */}
              <div style={{ background: "#0D1117", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 10, border: "1px solid #1E2D40" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>🚌</span>
                <p style={{ color: "#374151", fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                  <b style={{ color: "#4B5563" }}>Coming soon:</b> Bus routes and mixed MRT + bus journeys.
                </p>
              </div>
              <div style={{ background: "#0D1117", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, border: "1px solid #1E2D40" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>🔋</span>
                <p style={{ color: "#374151", fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                  <b style={{ color: "#4B5563" }}>Battery-friendly:</b> WiFi/cell location, not GPS chip.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setRouteMode("fastest"); buildRoute("fastest"); }} disabled={!canBuildRoute} style={{ flex: 1, padding: "14px 8px", borderRadius: 14, border: "none", background: canBuildRoute ? "#D42E12" : "#161B27", color: canBuildRoute ? "#fff" : "#374151", fontSize: 13, fontWeight: 700, cursor: canBuildRoute ? "pointer" : "not-allowed", boxShadow: canBuildRoute ? "0 8px 24px rgba(212,46,18,.4)" : "none", transition: "all .3s" }}>
                  ⚡ Fewest Stops
                </button>
                <button onClick={() => { setRouteMode("least-transfers"); buildRoute("least-transfers"); }} disabled={!canBuildRoute} style={{ flex: 1, padding: "14px 8px", borderRadius: 14, border: "none", background: canBuildRoute ? "#1D4ED8" : "#161B27", color: canBuildRoute ? "#fff" : "#374151", fontSize: 13, fontWeight: 700, cursor: canBuildRoute ? "pointer" : "not-allowed", boxShadow: canBuildRoute ? "0 8px 24px rgba(29,78,216,.4)" : "none", transition: "all .3s" }}>
                  🔁 Least Transfers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONFIRM ── */}
        {screen === S.CONFIRM && route && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 22px 28px", animation: "fadeUp .4s ease" }}>
            <button onClick={() => setScreen(S.INPUT)} style={{ background: "#161B27", border: "none", color: "#6B7280", width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>Your route</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>
                {fromStation?.name} → {toStation?.name} · {route.stopCount} stops · {route.transfers} transfer{route.transfers !== 1 ? "s" : ""}
              </p>
              <span style={{ background: route.mode === "least-transfers" ? "#1D4ED8" : "#7F1D1D", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "2px 7px", flexShrink: 0 }}>
                {route.mode === "least-transfers" ? "🔁 Least transfers" : "⚡ Fewest stops"}
              </span>
            </div>
            <button
              onClick={() => { const alt = route.mode === "least-transfers" ? "fastest" : "least-transfers"; setRouteMode(alt); buildRoute(alt); }}
              style={{ background: "#161B27", border: "1px solid #1E2D40", borderRadius: 10, padding: "7px 14px", color: "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 14, alignSelf: "flex-start" }}
            >
              ↔ Try {route.mode === "least-transfers" ? "fewest stops" : "least transfers"} instead
            </button>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["⇄", "Transfer alert", "#F59E0B", "#1c1400"], ["↓", "Alight alert", "#009645", "#052e16"]].map(([icon, label, color, bg], i) => (
                <div key={i} style={{ flex: 1, background: bg, border: `1px solid ${color}33`, borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color, fontSize: 13 }}>{icon}</span>
                  <span style={{ color, fontSize: 10, fontWeight: 700 }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#161B27", borderRadius: 18, padding: "12px 12px 12px 8px", flex: 1, overflowY: "auto", border: "1px solid #1E2D40", marginBottom: 14 }}>
              {route.legs.map((leg, li) => {
                const meta = LINE_META[leg.line] || { color: "#666" };
                const alertCodes = route.alerts.map(a => a.stopCode);
                return (
                  <div key={li}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, marginLeft: 26 }}>
                      <LinePill line={leg.line} small />
                      <span style={{ color: "#374151", fontSize: 10 }}>{meta.label}</span>
                    </div>
                    {leg.stops.map((stop, si) => {
                      const isTransfer = route.alerts.find(a => a.stopCode === stop.code && a.type === "transfer");
                      const isAlight = route.alerts.find(a => a.stopCode === stop.code && a.type === "alight");
                      const allStopsFlat = route.legs.flatMap(l => l.stops);
                      const legOffset = route.legs.slice(0, li).reduce((sum, l) => sum + l.stops.length, 0);
                      const gIdx = legOffset + si;
                      return (
                        <StopRow key={stop.code + si} stop={stop} color={meta.color} isFirst={si === 0} isLast={si === leg.stops.length - 1} isTransferAlert={!!isTransfer} isAlightAlert={!!isAlight} passed={passedStopIdx > gIdx} active={passedStopIdx === gIdx} />
                      );
                    })}
                    {li < route.legs.length - 1 && (
                      <div style={{ marginLeft: 26, marginTop: 2, marginBottom: 8 }}>
                        <span style={{ color: "#92400E", fontSize: 10, fontWeight: 600 }}>⇄ Transfer → {LINE_META[route.legs[li + 1].line]?.short}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setScreen(S.TRACKING); startGPS(); }} style={{ width: "100%", padding: 15, borderRadius: 14, border: "none", background: "#D42E12", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(212,46,18,.4)", marginBottom: 8 }}>
              📍 Start Tracking
            </button>
            <button onClick={() => { setScreen(S.TRACKING); startSim(); }} style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #1E2D40", background: "transparent", color: "#4B5563", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              🎮 Demo Mode
            </button>
          </div>
        )}

        {/* ── TRACKING ── */}
        {screen === S.TRACKING && route && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 20px 24px", animation: "fadeUp .4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <button onClick={() => { stopTracking(); setScreen(S.CONFIRM); }} style={{ background: "#161B27", border: "none", color: "#6B7280", width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
              <div>
                <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>Tracking · {fromStation?.name} → {toStation?.name}</h2>
                <p style={{ color: "#374151", fontSize: 11, margin: 0 }}>{gpsStatus === "ok" ? "📍 Low-power GPS on" : gpsStatus === "simulating" ? "🎮 Demo" : gpsStatus === "denied" ? "⚠️ GPS denied" : "Acquiring…"}</p>
              </div>
            </div>

            {activeAlert && !showMissed && <div style={{ marginBottom: 10 }}><AlertBanner alert={activeAlert} onMissed={() => { setShowMissed(true); setActiveAlertIdx(null); }} onTransferred={() => { firedRef.current.add(activeAlert.id); setActiveAlertIdx(null); }} /></div>}
            {showMissed && <div style={{ marginBottom: 10 }}><MissedPanel alerts={route.alerts} firedCount={firedRef.current.size} onDismiss={() => setShowMissed(false)} /></div>}

            {!activeAlert && !showMissed && (
              <div style={{ background: "#161B27", border: "1px solid #1E2D40", borderRadius: 14, padding: "14px", marginBottom: 10, textAlign: "center" }}>
                {(() => {
                  const nextAlert = nextUnfiredAlert;
                  if (!nextAlert) return <div style={{ color: "#374151", fontSize: 13, padding: "4px 0" }}>On your way…</div>;

                  const currentIdx = useSimMode ? simStopIdx : passedStopIdx;
                  const nextStop = allStopsFlat[currentIdx + 1];

                  if (useSimMode ? simStopIdx >= 0 : currentPos) {
                    return (
                      <>
                        <div style={{ color: "#374151", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>Next stop</div>
                        <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>{nextStop?.name ?? nextAlert.stopName}</div>
                        {nextStop && nextStop.code !== nextAlert.stopCode && (
                          <div style={{ color: "#374151", fontSize: 11, marginTop: 6 }}>
                            then <span style={{ color: nextAlert.type === "transfer" ? "#F59E0B" : "#9CA3AF", fontWeight: 600 }}>{nextAlert.stopName}</span>
                            {nextAlert.type === "transfer" && <span style={{ color: "#F59E0B" }}> · transfer</span>}
                            {nextAlert.type === "alight" && <span style={{ color: "#9CA3AF" }}> · alight</span>}
                          </div>
                        )}
                        {nextStop?.code === nextAlert.stopCode && (
                          <div style={{ color: nextAlert.type === "transfer" ? "#F59E0B" : "#4ade80", fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                            {nextAlert.type === "transfer" ? "⇄ transfer here" : "↓ alight here"}
                          </div>
                        )}
                      </>
                    );
                  }

                  return (
                    <div style={{ color: "#374151", fontSize: 13, animation: "pulse2 1.2s ease infinite", padding: "4px 0" }}>
                      {gpsStatus === "denied" ? "GPS blocked — use Demo Mode" : "Waiting for location…"}
                    </div>
                  );
                })()}
              </div>
            )}

            {useSimMode && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ height: 3, background: "#161B27", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${simProgress * 100}%`, background: "linear-gradient(90deg,#D42E12,#009645)", transition: "width .2s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ color: "#374151", fontSize: 10 }}>{fromStation?.name}</span>
                  <span style={{ fontSize: 12, animation: "trainSlide 1s ease infinite" }}>🚇</span>
                  <span style={{ color: "#374151", fontSize: 10 }}>{toStation?.name}</span>
                </div>
              </div>
            )}

            <div style={{ background: "#161B27", borderRadius: 18, padding: "12px 12px 12px 8px", flex: 1, overflowY: "auto", border: "1px solid #1E2D40" }}>
              {route.legs.map((leg, li) => {
                const meta = LINE_META[leg.line] || { color: "#666" };
                return (
                  <div key={li}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, marginLeft: 26 }}>
                      <LinePill line={leg.line} small />
                    </div>
                    {leg.stops.map((stop, si) => {
                      const gIdx = allStopsFlat.findIndex(s => s.code === stop.code);
                      const isTransfer = route.alerts.find(a => a.stopCode === stop.code && a.type === "transfer");
                      const isAlight = route.alerts.find(a => a.stopCode === stop.code && a.type === "alight");
                      return (
                        <StopRow key={stop.code + si} stop={stop} color={meta.color} isFirst={si === 0} isLast={si === leg.stops.length - 1} isTransferAlert={!!isTransfer} isAlightAlert={!!isAlight} passed={simStopIdx > gIdx} active={simStopIdx === gIdx} />
                      );
                    })}
                    {li < route.legs.length - 1 && (
                      <div style={{ marginLeft: 26, marginTop: 2, marginBottom: 8 }}>
                        <span style={{ color: "#92400E", fontSize: 10, fontWeight: 600 }}>⇄ {LINE_META[route.legs[li + 1].line]?.short}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!activeAlert && !showMissed && distanceM != null && distanceM <= 600 && (
              <button onClick={() => setShowMissed(true)} style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 12, border: "1px solid #1E2D40", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                😬 I missed my stop
              </button>
            )}
          </div>
        )}

        {/* ── DONE ── */}
        {screen === S.DONE && route && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", animation: "fadeUp .5s ease" }}>
            <div style={{ position: "relative", width: 120, height: 120, marginBottom: 28 }}>
              {[0, 1, 2].map(i => (<div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #009645", opacity: 0, animation: `ripple 1.8s ease-out ${i * .5}s infinite` }} />))}
              <div style={{ position: "absolute", inset: 16, borderRadius: "50%", background: "#009645", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 0 40px rgba(0,150,69,.6)", animation: "bounceIn .6s cubic-bezier(.34,1.56,.64,1)" }}>🔔</div>
            </div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Alight now!</h2>
            <p style={{ color: "#009645", fontSize: 16, fontWeight: 700, margin: "0 0 24px" }}>{toStation?.name} MRT</p>
            <div style={{ width: "100%", background: "#161B27", borderRadius: 18, padding: 18, marginBottom: 20, border: "1px solid #1E2D40" }}>
              {[["From", fromStation?.name], ["To", toStation?.name], ["Lines", route.legs.map(l => LINE_META[l.line]?.short).join(" → ")], ["Stops", route.stopCount]].map(([l, v], i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid #0D1117" : "none" }}>
                  <span style={{ color: "#4B5563", fontSize: 13 }}>{l}</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={reset} style={{ width: "100%", padding: 16, borderRadius: 16, border: "none", background: "#009645", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,150,69,.4)" }}>
              Plan Another Journey →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
