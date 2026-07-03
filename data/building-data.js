const floorAsset = "./assets/floors/floor_placeholder.svg";

const unitTemplates = [
  {
    code: "1",
    axoAsset: "./assets/units/unit-1-107.png",
    title: "Unidad 1 - 107 m2",
    areaM2: 107,
    typology: "3 ambientes + estudio",
    floorsLabel: "Del 1 al 8 piso",
    rooms: [
      "Estar comedor de 7.00 x 3.20 m",
      "Cocina de 3.20 x 1.90 m",
      "Dormitorio 1 de 3.30 x 3.00 m",
      "Bano dormitorio 1 de 2.30 x 1.60 m",
      "Vestidor dormitorio 1 de 2.20 x 1.50 m",
      "Dormitorio 2 de 3.00 x 3.00 m",
      "Bano dormitorio 2 de 1.95 x 1.60 m",
      "Vestidor dormitorio 2 de 1.55 x 1.50 m",
      "Estudio de 2.65 x 3.45 m",
      "Lavadero de 2.00 x 1.30 m",
      "Toilette de 1.65 x 1.00 m",
      "Balcon terraza con parrilla de 1.90 x 1.80 m"
    ]
  },
  {
    code: "2",
    axoAsset: "./assets/units/unit-2-84.png",
    title: "Unidad 2 - 84 m2",
    areaM2: 84,
    typology: "2 ambientes + estudio",
    floorsLabel: "Del 1 al 8 piso",
    rooms: [
      "Estar comedor de 5.80 x 3.85 m",
      "Cocina de 3.00 x 2.35 m",
      "Dormitorio principal de 3.15 x 3.00 m",
      "Bano de 2.00 x 1.60 m",
      "Vestidor de 2.70 x 1.90 m",
      "Estudio de 1.80 x 3.80 m",
      "Toilette de 2.00 x 1.20 m",
      "Balcon terraza con parrilla de 1.20 x 3.15 m"
    ]
  },
  {
    code: "3",
    axoAsset: "./assets/units/unit-3-58.png",
    title: "Unidad 3 - 58 m2",
    areaM2: 58,
    typology: "2 ambientes",
    floorsLabel: "Del 1 al 8 piso",
    rooms: [
      "Estar-comedor de 5.40 x 3.30 m",
      "Cocina de 3.25 x 1.70 m",
      "Dormitorio principal de 3.30 x 3.05 m",
      "Bano de 2.15 x 1.65 m",
      "Vestidor de 2.10 x 1.50 m",
      "Toilette de 1.65 x 1.00 m",
      "Balcon terraza con parrilla de 2.35 x 1.75 m"
    ]
  },
  {
    code: "4",
    axoAsset: "./assets/units/unit-4-57.png",
    title: "Unidad 4 - 57 m2",
    areaM2: 57,
    typology: "2 ambientes",
    floorsLabel: "Del 1 al 8 piso",
    rooms: [
      "Estar-comedor de 5.40 x 3.30 m",
      "Cocina de 3.25 x 1.70 m",
      "Dormitorio principal de 3.30 x 3.05 m",
      "Bano de 2.15 x 1.65 m",
      "Vestidor de 2.10 x 1.50 m",
      "Toilette de 1.65 x 1.00 m",
      "Balcon terraza con parrilla de 2.35 x 1.75 m"
    ]
  },
  {
    code: "5",
    axoAsset: "./assets/units/unit-5-107.png",
    title: "Unidad 5 - 107 m2",
    areaM2: 107,
    typology: "3 ambientes + estudio",
    floorsLabel: "Del 1 al 8 piso",
    rooms: [
      "Estar comedor de 7.00 x 3.20 m",
      "Cocina de 3.20 x 1.90 m",
      "Dormitorio 1 de 3.30 x 3.00 m",
      "Bano dormitorio 1 de 2.30 x 1.60 m",
      "Vestidor dormitorio 1 de 2.20 x 1.50 m",
      "Dormitorio 2 de 3.00 x 3.00 m",
      "Bano dormitorio 2 de 1.95 x 1.60 m",
      "Vestidor dormitorio 2 de 1.55 x 1.50 m",
      "Estudio de 2.65 x 3.45 m",
      "Lavadero de 2.00 x 1.30 m",
      "Toilette de 1.65 x 1.00 m",
      "Balcon terraza con parrilla de 1.90 x 1.80 m"
    ]
  }
];

const typicalUnits = Array.from({ length: 8 }, (_, floorIndex) => {
  const floor = floorIndex + 1;
  return unitTemplates.map((template) => ({
    id: `P${String(floor).padStart(2, "0")}-${template.code}`,
    floor,
    unit: template.code,
    title: template.title,
    areaM2: template.areaM2,
    typology: template.typology,
    floorsLabel: template.floorsLabel,
    rooms: template.rooms,
    status: "available",
    statusLabel: "Disponible",
    parking: true,
    parkingLabel: "Consultar",
    amenities: true,
    floorAsset: template.axoAsset
  }));
}).flat();

const ninthFloorUnits = [
  { code: "1", title: "Unidad 1 - 107 m2 + terraza", areaM2: 107, terraceM2: 105, typology: "3 ambientes + estudio", axoAsset: "./assets/units/p09-unit-a-107-terraza.png" },
  { code: "2", title: "Unidad 2 - 108 m2 + terraza", areaM2: 108, terraceM2: 105, typology: "3 ambientes + estudio", axoAsset: "./assets/units/p09-unit-b-108-terraza.png" },
  { code: "3", title: "Unidad 3 - 84 m2 + terraza", areaM2: 84, terraceM2: 77, typology: "2 ambientes + estudio", axoAsset: "./assets/units/p09-unit-c-84-terraza.png" },
  { code: "4", title: "Unidad 4 - 116 m2 + terraza", areaM2: 116, terraceM2: 100, typology: "3 ambientes", axoAsset: "./assets/units/p09-unit-d-116-terraza.png" }
].map((unit) => ({
  id: `P09-${unit.code}`,
  floor: 9,
  unit: unit.code,
  title: unit.title,
  areaM2: unit.areaM2,
  typology: unit.typology,
  floorsLabel: "Piso 9",
  rooms: [
    `Terraza privada de ${unit.terraceM2} m2`,
    "Parrilla propia",
    "Toilette en terraza",
    "Mini piscina propia"
  ],
  status: "available",
  statusLabel: "Disponible",
  parking: true,
  parkingLabel: "Consultar",
  amenities: true,
  floorAsset: unit.axoAsset
}));

export const buildingData = {
  building: {
    id: "developer_xv_symphony",
    name: "Developer XV - SYMPHONY",
    subtitle: "RESIDENCIAS",
    address: "Alsina 2547, Mar del Plata",
    floorsCount: 9,
    maxConfiguredFloors: 20,
    unitsPerFloor: 5,
    groundFloorAsset: "./assets/floors/ground-floor.png",
    buildingAssetBase: "./assets/building/building-main-00.png",
    buildingAssetPattern: "./assets/building/building-floor-{floor}.png"
  },
  summary: [
    "Sector de solarium con paisajismo.",
    "Quincho / SUM con parrilla a gas para 36 personas, TV, mesada de granito, horno, anafe y toilette propio.",
    "Gimnasio con espejo y TV totalmente equipado: cardio y pesas.",
    "Quincho y gimnasio con instalacion de equipos de aire acondicionado.",
    "Laundry en planta baja equipado con lavadoras y pileta de acero inoxidable con griferia de primera marca.",
    "Edificio de propiedad horizontal sobre lote ubicado en Alsina 2547, Mar del Plata.",
    "9 pisos residenciales, planta baja con amenities y subsuelo de cocheras.",
    "44 unidades de viviendas premium.",
    "Del 1 al 8 piso: 2 unidades de tres ambientes mas estudio de 107 m2 y 108 m2, 2 unidades de dos ambientes de 58 m2 y 1 unidad de dos ambientes mas estudio de 84 m2.",
    "Piso 9: unidades con terrazas privadas, parrilla, toilette y mini piscina propia.",
    "Subsuelo con 35 cocheras cubiertas y 27 bauleras individuales. Planta baja con 14 cocheras descubiertas."
  ],
  agent: {
    name: "Alan Yorno",
    role: "Agente Comercial",
    phone: "+54 9 2235 47-6350",
    whatsapp: "+54 9 2235 47-6350",
    email: "info@liongsa.com"
  },
  units: [...typicalUnits, ...ninthFloorUnits]
};
