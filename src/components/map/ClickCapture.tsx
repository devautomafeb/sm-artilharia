// Importa o hook useMapEvents da biblioteca react-leaflet,
// que permite "escutar" e reagir a eventos ocorridos no mapa (como cliques, zoom, movimento etc.)
import { useMapEvents } from "react-leaflet";

// Importa a função latLngToUtm (que converte coordenadas geográficas em UTM)
// e o tipo UtmCoord (para tipar corretamente o retorno da conversão)
import { latLngToUtm, type UtmCoord } from "../../functions/geo";

// Define o componente ClickCapture.
// Ele serve para "capturar" cliques no mapa e retornar as coordenadas convertidas para UTM.
export default function ClickCapture({
  onPick,
}: {
  // Props:
  // - active: indica qual ponto está sendo definido ("p1" ou "p2")
  // - onPick: função callback chamada ao clicar no mapa, recebendo a coordenada UTM
  active: "p1" | "p2";
  onPick: (utm: UtmCoord) => void;
}) {

  // Hook do react-leaflet que adiciona listeners de eventos no mapa atual.
  // Quando o usuário clica, executa a função passada no objeto.
  useMapEvents({
    click(e) {
      // Extrai latitude e longitude do clique
      const { lat, lng } = e.latlng;

      // Converte as coordenadas geográficas (lat/lng) em UTM
      const utm = latLngToUtm({ lat, lng });

      // Chama a função de callback onPick, passando o resultado da conversão
      onPick(utm);
    },
  });

  // O componente não precisa renderizar nada visualmente —
  // sua função é apenas registrar o evento de clique no mapa.
  return null;
}
