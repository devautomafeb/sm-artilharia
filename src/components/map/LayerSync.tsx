import { useEffect } from "react";
import { useMap } from "react-leaflet";

export type BaseMap = "roadmap" | "terrain" | "satellite";

export default function LayerSync({
  baseMap,
  onBaseMapChange,
}: {
  baseMap: BaseMap;
  onBaseMapChange: (b: BaseMap) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const onChange = (e: any) => {
      const name: string = e?.name ?? "";
      if (name.includes("OpenStreetMap")) onBaseMapChange("roadmap");
      else if (name.includes("OpenTopoMap")) onBaseMapChange("terrain");
      else if (name.includes("Esri")) onBaseMapChange("satellite");
    };

    map.on("baselayerchange", onChange);

    // ✅ cleanup deve ser uma função que não retorna nada
    return () => {
      map.off("baselayerchange", onChange);
    };
  }, [map, onBaseMapChange /* baseMap não é necessário aqui */]);

  return null;
}
