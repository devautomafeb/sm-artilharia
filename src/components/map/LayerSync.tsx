import { useEffect } from "react";
import { useMap } from "react-leaflet";

export type BaseMap = "roadmap" | "terrain" | "satellite";

// Agora só precisa de onBaseMapChange
export default function LayerSync({
  onBaseMapChange,
}: {
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
    return () => {
      map.off("baselayerchange", onChange);
    };
  }, [map, onBaseMapChange]);

  return null;
}
