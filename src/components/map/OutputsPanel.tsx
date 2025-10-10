type Props = {
  siteDeg: number | null;
  milsBase: 6400 | 6000;
  toMils: (deg: number | null, base: 6400 | 6000) => number | null;
  driftMil: number | null;
  bearingDeg: number | null;
  distMeters: number | null;
};

export default function OutputsPanel({ siteDeg, milsBase, toMils, driftMil, bearingDeg, distMeters }: Props) {
  return (
    <div className="rounded-2xl p-4 border shadow" style={{ background:"linear-gradient(135deg,#556B2F 0%,#3d4d24 100%)", borderColor:"#495c27" }}>
      <div className="text-sm font-semibold text-white/90 mb-3">Saídas</div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Elevação (geom.)</div>
          <div className="text-xl font-semibold text-white">{siteDeg == null ? "—" : `${siteDeg.toFixed(3)}°`}</div>
          <div className="text-[11px] text-white/80">{siteDeg == null ? "" : `${(toMils(siteDeg, milsBase) ?? 0).toFixed(2)} mil`}</div>
        </div>

        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Deriva (estim.)</div>
          <div className="text-xl font-semibold text-white">{driftMil == null ? "—" : `${driftMil.toFixed(2)} mil`}</div>
          <div className="text-[11px] text-white/80">sentido → direita</div>
        </div>

        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Direção (azimute)</div>
          <div className="text-xl font-semibold text-white">{bearingDeg == null ? "—" : `${bearingDeg.toFixed(2)}°`}</div>
          <div className="text-[11px] text-white/80">{bearingDeg == null ? "" : `${(toMils(bearingDeg, milsBase) ?? 0).toFixed(2)} mil`}</div>
        </div>

        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Distância</div>
          <div className="text-xl font-semibold text-white">{distMeters == null ? "—" : `${distMeters.toFixed(0)} m`}</div>
          <div className="text-[11px] text-white/80">{distMeters == null ? "" : `${(distMeters / 1000).toFixed(3)} km`}</div>
        </div>
      </div>

      <div className="text-[11px] text-white/80 mt-3">Obs.: Sítio/Elevação são geométricos (linha de visada).</div>
    </div>
  );
}
