// Importa o componente Polyline da biblioteca react-leaflet.
// Ele é usado para desenhar linhas no mapa entre coordenadas.
import { Polyline } from "react-leaflet";

// Importa o tipo LatLng definido no módulo de funções geográficas do projeto.
// Esse tipo representa um ponto com latitude e longitude.
import type { LatLng } from "../../functions/geo";

// Define o componente RouteLine, responsável por desenhar a linha entre dois pontos no mapa.
export default function RouteLine({
  p1,
  p2,
}: {
  // Tipagem das props:
  // - p1 e p2 são coordenadas geográficas (LatLng) ou null se não existirem ainda.
  p1: LatLng | null;
  p2: LatLng | null;
}) {
  // Se algum dos pontos não estiver definido, o componente não renderiza nada.
  if (!p1 || !p2) return null;

  // Caso ambos os pontos existam, desenha uma Polyline ligando p1 → p2.
  return (
    <Polyline
      positions={[
        [p1.lat, p1.lng], // ponto inicial
        [p2.lat, p2.lng], // ponto final
      ]}
      pathOptions={{
        opacity: 0.9, // define a transparência da linha
        weight: 4,    // espessura da linha em pixels
      }}
    />
  );
}
