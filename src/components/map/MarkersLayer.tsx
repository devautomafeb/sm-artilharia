// src/components/map/MarkersLayer.tsx
import { Marker, Popup } from "react-leaflet";
import type { LatLng } from "../../functions/geo";
import type { Icon, DivIcon } from "leaflet";

// Aceita ícone de qualquer tipo suportado pelo Marker
type LeafletIcon = Icon | DivIcon;

type Props = {
  p1: LatLng | null;
  p2: LatLng | null;
  name1: string;
  name2: string;
  icon1: LeafletIcon;
  icon2: LeafletIcon;
};

export default function MarkersLayer({ p1, p2, name1, name2, icon1, icon2 }: Props) {
  return (
    <>
      {p1 && (
        <Marker position={[p1.lat, p1.lng]} icon={icon1}>
          <Popup closeButton={false} autoPan={false}>
            <div className="text-xs">{name1}</div>
          </Popup>
        </Marker>
      )}
      {p2 && (
        <Marker position={[p2.lat, p2.lng]} icon={icon2}>
          <Popup closeButton={false} autoPan={false}>
            <div className="text-xs">{name2}</div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
