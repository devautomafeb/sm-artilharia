// Importa o tipo BaseMap definido em outro módulo (LayerSync).
// Esse tipo provavelmente é um union type com valores como "roadmap" | "terrain" | "satellite".
import type { BaseMap } from "./LayerSync";

// Define as props que o componente recebe:
// - baseMap: indica o tipo de mapa atualmente ativo.
// - setBaseMap: função que altera o mapa base ativo.
type Props = {
  baseMap: BaseMap;
  setBaseMap: (b: BaseMap) => void;
};

// Componente que exibe um card para seleção do tipo de mapa base.
export default function BaseMapCard({ baseMap, setBaseMap }: Props) {
  return (
    // Container principal do card com padding.
    <div className="card p-4">

      {/* Rótulo para o seletor */}
      <div className="label">Tipo de mapa</div>

      {/* Campo select para escolher entre diferentes mapas base */}
      <select
        className="select mt-1"
        value={baseMap}
        // Atualiza o mapa base quando o usuário muda a opção
        onChange={(e) => setBaseMap(e.target.value as BaseMap)}
      >
        {/* Opções de mapas disponíveis */}
        <option value="roadmap">OpenStreetMap (Roadmap)</option>
        <option value="terrain">OpenTopoMap (Terrain)</option>
        <option value="satellite">Esri WorldImagery (Satellite)</option>
      </select>

      {/* Texto informativo abaixo do seletor */}
      <div className="mt-3 text-xs text-slate-500">
        Padrão: satélite (Esri WorldImagery). Respeite as atribuições.
      </div>
    </div>
  );
}
