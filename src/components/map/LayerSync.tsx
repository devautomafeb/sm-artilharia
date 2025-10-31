// Importa o hook useEffect (para gerenciar efeitos colaterais)
// e o useMap (para acessar a instância atual do mapa Leaflet)
import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Define o tipo BaseMap, que representa os tipos de camadas de mapa possíveis
// - "roadmap": mapa de ruas (OpenStreetMap)
// - "terrain": mapa topográfico (OpenTopoMap)
// - "satellite": imagem de satélite (Esri WorldImagery)
export type BaseMap = "roadmap" | "terrain" | "satellite";

// Componente LayerSync
// Responsável por detectar quando o usuário muda o tipo de mapa base (camada) no Leaflet
// e informar essa mudança de volta ao componente pai por meio de onBaseMapChange.
export default function LayerSync({
  onBaseMapChange, // função callback chamada quando a camada base muda
}: {
  onBaseMapChange: (b: BaseMap) => void;
}) {

  // Usa o hook useMap para obter a instância do mapa Leaflet atual
  const map = useMap();

  // Efeito que adiciona e remove o listener para o evento de mudança de camada base
  useEffect(() => {
    // Função que será chamada quando o evento "baselayerchange" for disparado pelo Leaflet
    const onChange = (e: any) => {
      // Extrai o nome da camada ativa do evento
      const name: string = e?.name ?? "";

      // Identifica qual tipo de mapa base foi selecionado e comunica ao componente pai
      if (name.includes("OpenStreetMap")) onBaseMapChange("roadmap");
      else if (name.includes("OpenTopoMap")) onBaseMapChange("terrain");
      else if (name.includes("Esri")) onBaseMapChange("satellite");
    };

    // Adiciona o listener no mapa (ou seja, o componente "ouve" mudanças de camada)
    map.on("baselayerchange", onChange);

    // Remove o listener quando o componente é desmontado ou quando o mapa muda,
    // prevenindo múltiplas inscrições no evento e possíveis vazamentos de memória.
    return () => {
      map.off("baselayerchange", onChange);
    };
  // Dependências: o efeito será reexecutado se o mapa ou a função callback mudar
  }, [map, onBaseMapChange]);

  // O componente não renderiza nada visualmente — ele atua como um "sincronizador" invisível.
  return null;
}
