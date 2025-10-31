// Componente de HUD (heads-up display) com um resumo em tempo real de medidas balísticas/geométricas.
export default function MapHud({
  siteDeg,     // Elevação do tiro em graus (pode ser null se ainda não calculado)
  milsBase,    // Base do sistema de mils (6000 ou 6400)
  toMils,      // Função utilitária: converte graus → mils, respeitando a base
  driftMil,    // Deriva lateral em mils (sentido indicado no texto; aqui fixo "→ direita")
  bearingDeg,  // Direção/azimute (graus)
  distMeters,  // Distância entre os pontos em metros
}: {
  // Tipagem explícita das props
  siteDeg: number | null;
  milsBase: 6400 | 6000;
  toMils: (deg: number | null, base: 6400 | 6000) => number | null;
  driftMil: number | null;
  bearingDeg: number | null;
  distMeters: number | null;
}) {
  return (
    // Container flutuante centralizado no topo do mapa.
    // - absolute + top-3: posiciona no topo
    // - left-1/2 + -translate-x-1/2: centraliza horizontalmente
    // - z-[1000]: garante que fique acima das camadas do mapa
    // - bg-white/90 + backdrop-blur: painel translúcido com leve blur
    // - rounded-2xl + border + shadow: estética de card
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-slate-200 shadow">
      
      {/* Título pequeno e neutro */}
      <div className="text-[11px] text-slate-500 text-center">
        Resumo (tempo real)
      </div>

      {/* Linha de indicadores com espaçamento e sem quebra (whitespace-nowrap) */}
      <div className="mt-0.5 flex items-center gap-3 text-sm whitespace-nowrap">
        
        {/* Elevação: mostra em graus e em mils (convertido pela utilitária toMils) */}
        <span>
          <b>Elevação:</b>{" "}
          {siteDeg == null
            ? "-" // Quando ainda não há valor
            : `${siteDeg.toFixed(3)}°  |  ${(toMils(siteDeg, milsBase) ?? 0).toFixed(2)} mil`}
        </span>

        {/* Separador visual sutil */}
        <span className="opacity-40">|</span>

        {/* Deriva: valor em mils. Aqui o rótulo fixa "→ direita"; se drift tiver sinal, isso pode ser dinâmico. */}
        <span>
          <b>Deriva:</b>{" "}
          {driftMil == null
            ? "-"
            : `${driftMil.toFixed(2)} mil → direita`}
        </span>

        <span className="opacity-40">|</span>

        {/* Direção Geral de Tiro (DGT): graus e mils correspondentes */}
        <span>
          <b>DGT:</b>{" "}
          {bearingDeg == null
            ? "-"
            : `${bearingDeg.toFixed(2)}°  |  ${(toMils(bearingDeg, milsBase) ?? 0).toFixed(2)} mil`}
        </span>

        <span className="opacity-40">|</span>

        {/* Distância: metros e quilômetros formatados */}
        <span>
          <b>Distância:</b>{" "}
          {distMeters == null
            ? "-"
            : `${distMeters.toFixed(2)} m  (${(distMeters / 1000).toFixed(3)} km)`}
        </span>
      </div>
    </div>
  );
}
