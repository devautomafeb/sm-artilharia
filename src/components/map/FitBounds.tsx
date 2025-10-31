// Importa o hook useEffect, usado para executar efeitos colaterais (ex: atualizar o mapa após mudança de coordenadas)
import { useEffect } from "react";

// Importa o hook useMap da biblioteca react-leaflet,
// que fornece acesso direto à instância do mapa Leaflet atual.
import { useMap } from "react-leaflet";

// Importa o tipo LatLng (definido localmente no projeto em "../../functions/geo")
// e o tipo LatLngBoundsExpression do Leaflet (usado para definir limites geográficos)
import type { LatLng } from "../../functions/geo";
import type { LatLngBoundsExpression } from "leaflet";

// Componente FitBounds — responsável por ajustar automaticamente o zoom e o enquadramento do mapa
// de modo que dois pontos (p1 e p2) fiquem visíveis simultaneamente na tela.
export default function FitBounds({
  p1,
  p2,
  padding = 80, // valor padrão de padding (margem interna ao redor dos pontos)
}: {
  // Tipagem das props:
  // - p1: primeiro ponto (LatLng) ou null
  // - p2: segundo ponto (LatLng) ou null
  // - padding: espaçamento interno opcional ao redor dos limites (padrão 80 pixels)
  p1?: LatLng | null;
  p2?: LatLng | null;
  padding?: number;
}) {

  // Obtém a instância do mapa Leaflet atual para poder chamar métodos como `fitBounds`
  const map = useMap();

  // Efeito executado sempre que p1, p2, ou padding mudarem.
  // O objetivo é ajustar o mapa para enquadrar os dois pontos.
  useEffect(() => {
    // Só executa se ambos os pontos existirem
    if (p1 && p2) {
      // Cria um objeto de limites (bounding box) que engloba p1 e p2
      const bounds: LatLngBoundsExpression = [
        [p1.lat, p1.lng],
        [p2.lat, p2.lng],
      ];

      // Ajusta o zoom e a posição do mapa para que ambos os pontos caibam na tela
      // - fitBounds() faz o mapa "encaixar" nos limites fornecidos
      // - padding adiciona uma margem interna visual ao redor dos pontos
      map.fitBounds(bounds, { padding: [padding, padding] });
    }
  // Dependências do efeito:
  // Ele será reexecutado sempre que latitude/longitude de p1 ou p2 mudarem,
  // ou se o mapa ou o padding forem alterados.
  }, [p1?.lat, p1?.lng, p2?.lat, p2?.lng, map, padding]);

  // O componente não renderiza nada visualmente — apenas controla o comportamento do mapa
  return null;
}
