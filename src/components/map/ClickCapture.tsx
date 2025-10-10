import { useMapEvents } from "react-leaflet";
import { latLngToUtm, type UtmCoord } from "../../functions/geo";

export default function ClickCapture({ onPick }: { active: "p1" | "p2"; onPick: (utm: UtmCoord) => void }) {
  useMapEvents({
    click(e) {
      const utm = latLngToUtm({ lat: e.latlng.lat, lng: e.latlng.lng });
      onPick(utm);
    },
  });
  return null;
}
