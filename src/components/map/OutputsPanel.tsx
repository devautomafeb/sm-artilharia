import { useState, useMemo } from "react";

type Props = {
  siteDeg: number | null;
  milsBase: 6400 | 6000;
  toMils: (deg: number | null, base: 6400 | 6000) => number | null;
  driftMil: number | null;
  bearingDeg: number | null;
  distMeters: number | null;
};

export default function OutputsPanel({
  siteDeg,
  milsBase,
  toMils,
  driftMil,
  bearingDeg,
  distMeters,
}: Props) {
  const [qm, setQm] = useState<number>(0);
  const [corrDeriva, setCorrDeriva] = useState<number>(0);
  const [corrAlcance, setCorrAlcance] = useState<number>(0);

  const bearingMil = useMemo(
    () => (bearingDeg == null ? null : toMils(bearingDeg, milsBase)),
    [bearingDeg, milsBase, toMils]
  );

  const dgt = useMemo(() => {
    if (bearingMil == null) return null;
    const val = milsBase - bearingMil - qm;
    return val < 0 ? val + milsBase : val;
  }, [bearingMil, milsBase, qm]);

  return (
    <div
      className="w-full col-span-full rounded-2xl p-4 border shadow-lg max-w-none"
      style={{
        background: "linear-gradient(135deg,#111 0%,#000 100%)", // 🔥 fundo preto degradê
        borderColor: "#333", // borda cinza-escura
      }}
    >
      <div className="text-sm font-semibold text-yellow-100 mb-3">
        Saídas (Cálculos Balísticos)
      </div>

      <div className="grid w-full gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] auto-rows-fr">

        {/* QM */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">QM (constante)</div>
          <input
            type="number"
            className="w-24 mx-auto mt-1 rounded bg-yellow-950/30 text-center text-yellow-100 border border-yellow-700/40 text-sm"
            value={qm}
            onChange={(e) => setQm(Number(e.target.value))}
          />
          <div className="text-[11px] text-yellow-200/70 mt-1">mil</div>
        </div>

        {/* Correção de Deriva */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Correção de Deriva</div>
          <input
            type="number"
            className="w-24 mx-auto mt-1 rounded bg-yellow-950/30 text-center text-yellow-100 border border-yellow-700/40 text-sm"
            value={corrDeriva}
            onChange={(e) => setCorrDeriva(Number(e.target.value))}
          />
          <div className="text-[11px] text-yellow-200/70 mt-1">mil</div>
        </div>

        {/* Correção de Alcance */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Correção de Alcance</div>
          <input
            type="number"
            className="w-24 mx-auto mt-1 rounded bg-yellow-950/30 text-center text-yellow-100 border border-yellow-700/40 text-sm"
            value={corrAlcance}
            onChange={(e) => setCorrAlcance(Number(e.target.value))}
          />
          <div className="text-[11px] text-yellow-200/70 mt-1">m</div>
        </div>

        {/* Distância */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Distância</div>
          <div className="text-xl font-semibold text-yellow-100">
            {distMeters == null ? "—" : `${distMeters.toFixed(0)} m`}
          </div>
          <div className="text-[11px] text-yellow-200/70">
            {distMeters == null ? "" : `${(distMeters / 1000).toFixed(3)} km`}
          </div>
        </div>

        {/* Lançamento */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Lançamento (azimute carta)</div>
          <div className="text-xl font-semibold text-yellow-100">
            {bearingMil == null ? "—" : `${bearingMil.toFixed(2)} mil`}
          </div>
          <div className="text-[11px] text-yellow-200/70 mb-1">
            {bearingDeg == null ? "" : `${bearingDeg.toFixed(2)}°`}
          </div>
        </div>

        {/* DGT */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">DGT (Direção Geral de Tiro)</div>
          <div className="text-xl font-semibold text-yellow-100">
            {dgt == null ? "—" : `${dgt.toFixed(0)} mil`}
          </div>
          <div className="text-[11px] text-yellow-200/70">
            Base {milsBase} − Lanç. − QM
          </div>
        </div>

        {/* Deriva */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Deriva (estim.)</div>
          <div className="text-xl font-semibold text-yellow-100">
            {driftMil == null ? "—" : `${driftMil.toFixed(0)} mil`}
          </div>
          <div className="text-[11px] text-yellow-200/70">sentido → direita</div>
        </div>

        {/* Elevação */}
        <div className="flex flex-col justify-center rounded-xl bg-yellow-900/20 border border-yellow-600/40 p-3 text-center shadow-inner">
          <div className="text-[11px] text-yellow-200/80">Elevação (geom.)</div>
          <div className="text-xl font-semibold text-yellow-100">
            {siteDeg == null
              ? "—"
              : `${(toMils(siteDeg, milsBase) ?? 0).toFixed(0)} mil`}
          </div>
          <div className="text-[11px] text-yellow-200/70">
            {siteDeg == null ? "" : `${siteDeg.toFixed(0)}°`}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-yellow-200/70 mt-3">
        Obs.: Sítio/Elevação são geométricos (linha de visada).
      </div>
    </div>
  );
}
