// Componente que exibe botões flutuantes no mapa para alternar
// qual ponto (P1 ou P2) será definido ao clicar no mapa.
export default function MapPointControls({
  activeTarget,       // Indica o ponto atualmente ativo: "p1" ou "p2"
  setActiveTarget,    // Função callback que atualiza o ponto ativo
}: {
  // Tipagem explícita das props
  activeTarget: "p1" | "p2";
  setActiveTarget: (v: "p1" | "p2") => void;
}) {
  return (
    // Container principal flutuante no canto inferior direito do mapa
    // - absolute + bottom-3 + right-3: posicionamento fixo
    // - z-[1000]: garante que fique acima dos outros elementos do mapa
    // - bg-white/95 + backdrop-blur: leve transparência e desfoque de fundo
    // - rounded-xl + border + shadow: aparência de card elegante
    <div className="absolute bottom-3 right-3 z-[1000] rounded-xl bg-white/95 backdrop-blur px-2 py-1 border border-slate-200 shadow">
      
      {/* Linha com o rótulo e os botões de seleção */}
      <div className="flex items-center gap-2">

        {/* Indicador do sistema de coordenadas atual */}
        <span className="pill text-[10px] px-2 py-[2px]">
          WGS84 • UTM
        </span>

        {/* Contêiner dos botões P1 e P2 */}
        {/* inline-flex: organiza os botões lado a lado */}
        {/* overflow-hidden + rounded-xl + border: define visual de botão agrupado */}
        <div className="inline-flex overflow-hidden rounded-xl border border-slate-300 bg-white">

          {/* Botão para selecionar o Ponto 1 */}
          <button
            onClick={() => setActiveTarget("p1")} // define P1 como ativo
            className={`btn-toggle ${
              activeTarget === "p1"
                ? "btn-toggle-active" // estilo ativo
                : "btn-toggle-idle"   // estilo inativo
            } text-xs px-2 py-1`}
            title="Definir Ponto 1 pelo clique"
          >
            P1
          </button>

          {/* Botão para selecionar o Ponto 2 */}
          <button
            onClick={() => setActiveTarget("p2")} // define P2 como ativo
            className={`btn-toggle ${
              activeTarget === "p2"
                ? "btn-toggle-active"
                : "btn-toggle-idle"
            } text-xs px-2 py-1`}
            title="Definir Ponto 2 pelo clique"
          >
            P2
          </button>
        </div>
      </div>
    </div>
  );
}
