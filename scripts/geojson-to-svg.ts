/**
 * Converts Wales local authority GeoJSON to simplified SVG path data.
 *
 * Usage: npx tsx scripts/geojson-to-svg.ts input.geojson
 *
 * Outputs a TypeScript file with SVG path data for each county.
 */

import { readFileSync, writeFileSync } from "fs";

// Map ONS LAD names to our county slugs
const NAME_TO_SLUG: Record<string, string> = {
  "Isle of Anglesey": "ynys-mon",
  "Gwynedd": "gwynedd",
  "Conwy": "conwy",
  "Denbighshire": "sir-ddinbych",
  "Flintshire": "sir-y-fflint",
  "Wrexham": "wrecsam",
  "Ceredigion": "ceredigion",
  "Pembrokeshire": "sir-benfro",
  "Carmarthenshire": "sir-gaerfyrddin",
  "Swansea": "abertawe",
  "Neath Port Talbot": "castell-nedd-port-talbot",
  "Bridgend": "pen-y-bont-ar-ogwr",
  "Vale of Glamorgan": "bro-morgannwg",
  "Cardiff": "caerdydd",
  "Rhondda Cynon Taf": "rhondda-cynon-taf",
  "Caerphilly": "caerffili",
  "Blaenau Gwent": "blaenau-gwent",
  "Torfaen": "torfaen",
  "Monmouthshire": "sir-fynwy",
  "Newport": "casnewydd",
  "Powys": "powys",
  "Merthyr Tydfil": "merthyr-tudful",
};

interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

function projectPoint(lng: number, lat: number, bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number }, width: number, height: number): [number, number] {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
  // Flip Y axis (lat increases upward, SVG y increases downward)
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function simplifyCoords(coords: number[][], tolerance: number): number[][] {
  if (coords.length <= 2) return coords;

  // Simple Ramer-Douglas-Peucker
  let maxDist = 0;
  let maxIdx = 0;
  const first = coords[0];
  const last = coords[coords.length - 1];

  for (let i = 1; i < coords.length - 1; i++) {
    const dist = pointToLineDist(coords[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyCoords(coords.slice(0, maxIdx + 1), tolerance);
    const right = simplifyCoords(coords.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

function pointToLineDist(point: number[], lineStart: number[], lineEnd: number[]): number {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.sqrt((point[0] - lineStart[0]) ** 2 + (point[1] - lineStart[1]) ** 2);
  const t = Math.max(0, Math.min(1, ((point[0] - lineStart[0]) * dx + (point[1] - lineStart[1]) * dy) / len2));
  const projX = lineStart[0] + t * dx;
  const projY = lineStart[1] + t * dy;
  return Math.sqrt((point[0] - projX) ** 2 + (point[1] - projY) ** 2);
}

function coordsToPath(coords: number[][], bounds: any, width: number, height: number): string {
  const simplified = simplifyCoords(coords, 0.005); // Simplify for smaller SVG
  const points = simplified.map(([lng, lat]) => projectPoint(lng, lat, bounds, width, height));
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join("") + "Z";
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: npx tsx scripts/geojson-to-svg.ts input.geojson");
    process.exit(1);
  }

  const geojson = JSON.parse(readFileSync(inputPath, "utf-8"));
  const features: GeoJSONFeature[] = geojson.features;

  console.log(`Processing ${features.length} features...`);

  // Calculate bounds
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;

  for (const feature of features) {
    const coords = feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates.flat(2) as number[][]
      : (feature.geometry.coordinates as number[][][]).flat() as number[][];

    for (const [lng, lat] of coords) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }

  const bounds = { minLng, maxLng, minLat, maxLat };
  const width = 500;
  const aspectRatio = (maxLat - minLat) / (maxLng - minLng) * 1.4; // Adjust for Mercator
  const height = Math.round(width * aspectRatio);

  console.log(`Bounds: ${minLng},${minLat} to ${maxLng},${maxLat}`);
  console.log(`SVG: ${width}x${height}`);

  const countyPaths: { slug: string; name: string; path: string; center: [number, number] }[] = [];

  for (const feature of features) {
    const name = feature.properties.LAD23NM || feature.properties.name || "";
    const slug = NAME_TO_SLUG[name];

    if (!slug) {
      console.warn(`Unknown county: ${name}`);
      continue;
    }

    let pathD = "";

    if (feature.geometry.type === "MultiPolygon") {
      for (const polygon of feature.geometry.coordinates as number[][][][]) {
        pathD += coordsToPath(polygon[0], bounds, width, height) + " ";
      }
    } else {
      for (const ring of feature.geometry.coordinates as number[][][]) {
        pathD += coordsToPath(ring, bounds, width, height) + " ";
      }
    }

    // Calculate centroid for label placement
    const allCoords = feature.geometry.type === "MultiPolygon"
      ? (feature.geometry.coordinates as number[][][][]).flat(2)
      : (feature.geometry.coordinates as number[][][]).flat();

    const avgLng = allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length;
    const avgLat = allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length;
    const center = projectPoint(avgLng, avgLat, bounds, width, height);

    countyPaths.push({ slug, name, path: pathD.trim(), center });
    console.log(`  ${name} → ${slug} (${pathD.length} chars)`);
  }

  // Output TypeScript
  const output = `// Auto-generated from ONS Open Geography Portal GeoJSON
// Wales local authority boundaries (OGL v3.0)

export interface CountyPath {
  slug: string;
  name: string;
  path: string;
  center: [number, number];
}

export const WALES_SVG_WIDTH = ${width};
export const WALES_SVG_HEIGHT = ${height};

export const countyPaths: CountyPath[] = ${JSON.stringify(countyPaths, null, 2)};
`;

  writeFileSync("src/components/maps/wales-paths.ts", output);
  console.log(`\nWritten to src/components/maps/wales-paths.ts`);
}

main();
