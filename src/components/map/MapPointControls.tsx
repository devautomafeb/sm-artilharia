export default function MapPointControls({ activeTarget, setActiveTarget }: { activeTarget: "p1" | "p2"; setActiveTarget: (v: "p1" | "p2") => void; }) {
  return (
    <div className="absolute bottom-3 right-3 z-[1000] rounded-xl bg-white/95 backdrop-blur px-2 py-1 border border-slate-200 shadow">
      <div className="flex items-center gap-2">
        <span className="pill text-[10px] px-2 py-[2px]">WGS84 • UTM</span>
        <div className="inline-flex overflow-hidden rounded-xl border border-slate-300 bg-white">
          <button onClick={() => setActiveTarget("p1")} className={`btn-toggle ${activeTarget === "p1" ? "btn-toggle-active" : "btn-toggle-idle"} text-xs px-2 py-1`} title="Definir Ponto 1 pelo clique">P1</button>
          <button onClick={() => setActiveTarget("p2")} className={`btn-toggle ${activeTarget === "p2" ? "btn-toggle-active" : "btn-toggle-idle"} text-xs px-2 py-1`} title="Definir Ponto 2 pelo clique">P2</button>
        </div>
      </div>
    </div>
  );
}
