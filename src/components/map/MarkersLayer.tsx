// src/components/map/MarkersLayer.tsx

// Importa os componentes do React Leaflet necessários para exibir marcadores no mapa
import { Marker, Popup } from "react-leaflet";

// Importa o tipo LatLng (definido no seu módulo de funções geográficas),
// além dos tipos Icon e DivIcon, usados para representar ícones no Leaflet
import type { LatLng } from "../../functions/geo";
import type { Icon, DivIcon } from "leaflet";

// Define um tipo auxiliar para permitir que o ícone seja de qualquer tipo aceito pelo Marker.
// (O Marker do Leaflet aceita tanto Icon quanto DivIcon)
type LeafletIcon = Icon | DivIcon;

// Define as props que o componente recebe
type Props = {
  p1: LatLng | null;   // Coordenadas do primeiro ponto (ou null se não definido)
  p2: LatLng | null;   // Coordenadas do segundo ponto (ou null se não definido)
  name1: string;       // Nome do ponto 1 (exibido no popup)
  name2: string;       // Nome do ponto 2 (exibido no popup)
  icon1: LeafletIcon;  // Ícone usado para o ponto 1
  icon2: LeafletIcon;  // Ícone usado para o ponto 2
};

// Componente principal MarkersLayer
// Sua função é exibir marcadores no mapa quando os pontos p1 e p2 existirem.
export default function MarkersLayer({
  p1,
  p2,
  name1,
  name2,
  icon1,
  icon2,
}: Props) {
  return (
    <>
      {/* Se p1 estiver definido, renderiza o marcador correspondente */}
      {p1 && (
        <Marker
          position={[p1.lat, p1.lng]} // Posição do marcador
          icon={icon1}                // Ícone personalizado
        >
          {/* Popup associado ao marcador.
              - closeButton={false}: remove o botão de fechar
              - autoPan={false}: evita que o mapa se mova ao abrir o popup */}
          <Popup closeButton={false} autoPan={false}>
            <div className="text-xs">{name1}</div>
          </Popup>
        </Marker>
      )}

      {/* Renderiza o segundo marcador se p2 existir */}
      {p2 && (
        <Marker
          position={[p2.lat, p2.lng]}
          icon={icon2}
        >
          <Popup closeButton={false} autoPan={false}>
            <div className="text-xs">{name2}</div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
