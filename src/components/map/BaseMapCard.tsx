import type { BaseMap } from "./LayerSync";
type Props = { baseMap: BaseMap; setBaseMap: (b: BaseMap) => void; };

export default function BaseMapCard({ baseMap, setBaseMap }: Props) {
  return (
    <div className="card p-4">
      <div className="label">Tipo de mapa</div>
      <select className="select mt-1" value={baseMap} onChange={(e) => setBaseMap(e.target.value as BaseMap)}>
        <option value="roadmap">OpenStreetMap (Roadmap)</option>
        <option value="terrain">OpenTopoMap (Terrain)</option>
        <option value="satellite">Esri WorldImagery (Satellite)</option>
      </select>
      <div className="mt-3 text-xs text-slate-500">Padrão: satélite (Esri WorldImagery). Respeite as atribuições.</div>
    </div>
  );
}
