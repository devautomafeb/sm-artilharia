type Props = {
  altCB: number | "";
  setAltCB: (v: number | "") => void;
  altPV: number | "";
  setAltPV: (v: number | "") => void;
  milsBase: 6400 | 6000;
  setMilsBase: (v: 6400 | 6000) => void;
  deltaH: number | null;
};

export default function AltSysCard({ altCB, setAltCB, altPV, setAltPV, milsBase, setMilsBase, deltaH }: Props) {
  return (
    <div className="card p-4">
      <div className="text-sm font-semibold mb-2">Altitudes (m) & Sistema</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="label">altitude_CB</div>
          <input className="input mt-1" type="number" placeholder="ex: 120" value={altCB}
                 onChange={(e) => setAltCB(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div>
          <div className="label">altitude_PV</div>
          <input className="input mt-1" type="number" placeholder="ex: 85" value={altPV}
                 onChange={(e) => setAltPV(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div className="col-span-2">
          <div className="label">Sistema de mils</div>
          <select className="select mt-1 w-full" value={milsBase}
                  onChange={(e) => setMilsBase(Number(e.target.value) as 6400 | 6000)}>
            <option value={6400}>6400 mil</option>
            <option value={6000}>6000 mil</option>
          </select>
        </div>
      </div>
      {deltaH != null && <div className="mt-2 text-xs text-slate-600">Δh (PV − CB): <b>{deltaH.toFixed(2)} m</b></div>}
    </div>
  );
}
