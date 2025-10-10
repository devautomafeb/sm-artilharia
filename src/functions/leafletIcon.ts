// src/functions/leafletIcon.ts
import L from "leaflet";

export function makeLfIcon(imageUrl: string, sizePx: number) {
  const s = Math.max(16, Math.round(sizePx));
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [s, s],
    iconAnchor: [Math.round(s / 2), s],
    popupAnchor: [0, -s + 8],
    className: "shadow-none",
  });
}
