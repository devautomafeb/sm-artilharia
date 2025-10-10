import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLng } from "../../functions/geo";
import type { LatLngBoundsExpression } from "leaflet";

export default function FitBounds({ p1, p2, padding = 80 }: { p1?: LatLng | null; p2?: LatLng | null; padding?: number }) {
  const map = useMap();
  useEffect(() => {
    if (p1 && p2) {
      const bounds: LatLngBoundsExpression = [
        [p1.lat, p1.lng],
        [p2.lat, p2.lng],
      ];
      map.fitBounds(bounds, { padding: [padding, padding] });
    }
  }, [p1?.lat, p1?.lng, p2?.lat, p2?.lng, map, padding]);
  return null;
}
