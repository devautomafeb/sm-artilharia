// Define o tipo das props que o componente receberá
// - activeTarget: indica qual ponto está ativo ("p1" ou "p2")
// - setActiveTarget: função que atualiza o ponto ativo
type Props = {
  activeTarget: "p1" | "p2";
  setActiveTarget: (v: "p1" | "p2") => void;
};

// Componente principal
export default function ActionClickCard({ activeTarget, setActiveTarget }: Props) {
  return (
    // Container principal do card
    <div className="card p-4">
      
      {/* Cabeçalho do card */}
      <div className="flex items-center justify-between">
        {/* Título pequeno e semibold */}
        <div className="text-sm font-semibold text-slate-700">
          Definir ponto pelo clique
        </div>

        {/* Etiqueta com o sistema de coordenadas atual */}
        <span className="pill">WGS84 • UTM</span>
      </div>

      {/* Seção de botões que alternam entre "Ponto 1" e "Ponto 2" */}
      <div className="mt-3 inline-flex overflow-hidden rounded-2xl border border-slate-300 bg-white">
        {/* Botão para selecionar o Ponto 1 */}
        <button
          onClick={() => setActiveTarget("p1")}
          className={`btn-toggle ${
            activeTarget === "p1" ? "btn-toggle-active" : "btn-toggle-idle"
          }`}
        >
          Ponto 1
        </button>

        {/* Botão para selecionar o Ponto 2 */}
        <button
          onClick={() => setActiveTarget("p2")}
          className={`btn-toggle ${
            activeTarget === "p2" ? "btn-toggle-active" : "btn-toggle-idle"
          }`}
        >
          Ponto 2
        </button>
      </div>

      {/* Texto auxiliar abaixo dos botões */}
      <p className="text-xs text-slate-500 mt-2">
        Clique no mapa para posicionar o ponto ativo. Você pode ajustar manualmente depois.
      </p>
    </div>
  );
}
