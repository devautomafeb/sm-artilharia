export default function MapHud({
  siteDeg, milsBase, toMils, driftMil, bearingDeg, distMeters,
}: {
  siteDeg: number | null; milsBase: 6400 | 6000; toMils: (deg: number | null, base: 6400 | 6000) => number | null;
  driftMil: number | null; bearingDeg: number | null; distMeters: number | null;
}) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-slate-200 shadow">
      <div className="text-[11px] text-slate-500 text-center">Resumo (tempo real)</div>
      <div className="mt-0.5 flex items-center gap-3 text-sm whitespace-nowrap">
        <span><b>Elevação:</b> {siteDeg == null ? "-" : `${siteDeg.toFixed(3)}°  |  ${(toMils(siteDeg, milsBase) ?? 0).toFixed(2)} mil`}</span>
        <span className="opacity-40">|</span>
        <span><b>Deriva:</b> {driftMil == null ? "-" : `${driftMil.toFixed(2)} mil → direita`}</span>
        <span className="opacity-40">|</span>
        <span><b>DGT:</b> {bearingDeg == null ? "-" : `${bearingDeg.toFixed(2)}°  |  ${(toMils(bearingDeg, milsBase) ?? 0).toFixed(2)} mil`}</span>
        <span className="opacity-40">|</span>
        <span><b>Distância:</b> {distMeters == null ? "-" : `${distMeters.toFixed(2)} m  (${(distMeters / 1000).toFixed(3)} km)`}</span>
      </div>
    </div>
  );
}
