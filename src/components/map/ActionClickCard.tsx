type Props = { activeTarget: "p1" | "p2"; setActiveTarget: (v: "p1" | "p2") => void; };

export default function ActionClickCard({ activeTarget, setActiveTarget }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">Definir ponto pelo clique</div>
        <span className="pill">WGS84 • UTM</span>
      </div>
      <div className="mt-3 inline-flex overflow-hidden rounded-2xl border border-slate-300 bg-white">
        <button onClick={() => setActiveTarget("p1")} className={`btn-toggle ${activeTarget === "p1" ? "btn-toggle-active" : "btn-toggle-idle"}`}>Ponto 1</button>
        <button onClick={() => setActiveTarget("p2")} className={`btn-toggle ${activeTarget === "p2" ? "btn-toggle-active" : "btn-toggle-idle"}`}>Ponto 2</button>
      </div>
      <p className="text-xs text-slate-500 mt-2">Clique no mapa para posicionar o ponto ativo. Você pode ajustar manualmente depois.</p>
    </div>
  );
}
