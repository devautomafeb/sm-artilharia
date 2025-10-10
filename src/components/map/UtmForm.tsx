import { utmToLatLng, type UtmCoord } from "../../functions/geo";

export default function UtmForm({ title, utm, setUtm }: { title: string; utm: UtmCoord; setUtm: (u: UtmCoord) => void }) {
  const p = utmToLatLng(utm);
  return (
    <div className="card p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="label">Zona</div>
          <input className="input mt-1" type="number" min={1} max={60} value={utm.zone}
                 onChange={(e) => setUtm({ ...utm, zone: Number(e.target.value) })} />
        </div>
        <div>
          <div className="label">Hemisfério</div>
          <select className="select mt-1" value={utm.hemisphere}
                  onChange={(e) => setUtm({ ...utm, hemisphere: e.target.value as "N" | "S" })}>
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
        <div>
          <div className="label">Easting (m)</div>
          <input className="input mt-1" type="number" placeholder="ex: 345000" value={utm.easting}
                 onChange={(e) => setUtm({ ...utm, easting: e.target.value })} />
        </div>
        <div>
          <div className="label">Northing (m)</div>
          <input className="input mt-1" type="number" placeholder="ex: 7400000" value={utm.northing}
                 onChange={(e) => setUtm({ ...utm, northing: e.target.value })} />
        </div>
      </div>
      {p && <div className="mt-2 text-xs text-slate-600">Lat/Lng: <b>{p.lat.toFixed(6)}</b>, <b>{p.lng.toFixed(6)}</b></div>}
    </div>
  );
}
