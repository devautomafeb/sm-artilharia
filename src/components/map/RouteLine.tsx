import { Polyline } from "react-leaflet";
import type { LatLng } from "../../functions/geo";

export default function RouteLine({ p1, p2 }: { p1: LatLng | null; p2: LatLng | null }) {
  if (!p1 || !p2) return null;
  return <Polyline positions={[[p1.lat, p1.lng], [p2.lat, p2.lng]]} pathOptions={{ opacity: 0.9, weight: 4 }} />;
}
