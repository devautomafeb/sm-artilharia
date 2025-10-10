import proj4 from "proj4";

// Tipos
export type UtmCoord = {
  zone: number;
  hemisphere: "N" | "S";
  easting: number | string;
  northing: number | string;
};
export type LatLng = { lat: number; lng: number };

// UTM -> WGS84
export function utmToLatLng({ zone, hemisphere, easting, northing }: UtmCoord): LatLng | null {
  if (!zone || easting === "" || northing === "") return null;
  const south = hemisphere?.toUpperCase().startsWith("S");
  const utmProj = `+proj=utm +zone=${zone} ${south ? "+south " : ""}+datum=WGS84 +units=m +no_defs`;
  const [lng, lat] = proj4(utmProj, "WGS84", [Number(easting), Number(northing)]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

// WGS84 -> UTM (se precisar)
export function latLngToUtm({ lat, lng }: LatLng): UtmCoord {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const hemisphere: "N" | "S" = lat < 0 ? "S" : "N";
  const utmProj = `+proj=utm +zone=${zone} ${hemisphere === "S" ? "+south " : ""}+datum=WGS84 +units=m +no_defs`;
  const [easting, northing] = proj4("WGS84", utmProj, [lng, lat]);
  return {
    zone,
    hemisphere,
    easting: Number((easting as number).toFixed(3)),
    northing: Number((northing as number).toFixed(3)),
  };
}

// Distância (Haversine)
export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Azimute inicial
export function initialBearingDegrees(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lng - a.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Deg -> mils (base configurável)
export function toMils(deg: number | null, base: 6400 | 6000): number | null {
  return deg == null ? null : (deg * base) / 360;
}
