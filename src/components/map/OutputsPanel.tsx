// Define o tipo das props que o componente recebe.
// Cada campo representa um resultado calculado que será exibido na interface.
type Props = {
  siteDeg: number | null; // ângulo de elevação geométrica em graus
  milsBase: 6400 | 6000; // base angular em mils usada (padrão NATO ou OTAN)
  toMils: (deg: number | null, base: 6400 | 6000) => number | null; // função de conversão grau→mil
  driftMil: number | null; // deriva lateral (em mils)
  bearingDeg: number | null; // azimute/direção do tiro (em graus)
  distMeters: number | null; // distância entre os pontos (em metros)
};

// Componente que exibe um painel visual com as saídas dos cálculos de tiro/medição.
export default function OutputsPanel({
  siteDeg,
  milsBase,
  toMils,
  driftMil,
  bearingDeg,
  distMeters,
}: Props) {
  return (
    // Painel principal com gradiente de fundo e bordas personalizadas.
    <div
      className="rounded-2xl p-4 border shadow"
      style={{
        background: "linear-gradient(135deg,#556B2F 0%,#3d4d24 100%)", // verde-oliva degradê
        borderColor: "#495c27", // tom escuro para combinar com o fundo
      }}
    >
      {/* Título do painel */}
      <div className="text-sm font-semibold text-white/90 mb-3">
        Saídas
      </div>

      {/* Grade responsiva:
          - 1 coluna em telas pequenas
          - 2 colunas em telas médias
          - 4 colunas em telas grandes */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">

        {/* --- BLOCO 1: Elevação geométrica --- */}
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Elevação (geom.)</div>
          <div className="text-xl font-semibold text-white">
            {siteDeg == null ? "—" : `${siteDeg.toFixed(3)}°`}
          </div>
          <div className="text-[11px] text-white/80">
            {siteDeg == null
              ? ""
              : `${(toMils(siteDeg, milsBase) ?? 0).toFixed(2)} mil`}
          </div>
        </div>

        {/* --- BLOCO 2: Deriva estimada --- */}
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Deriva (estim.)</div>
          <div className="text-xl font-semibold text-white">
            {driftMil == null ? "—" : `${driftMil.toFixed(2)} mil`}
          </div>
          <div className="text-[11px] text-white/80">sentido → direita</div>
        </div>

        {/* --- BLOCO 3: Direção (azimute) --- */}
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Direção (azimute)</div>
          <div className="text-xl font-semibold text-white">
            {bearingDeg == null ? "—" : `${bearingDeg.toFixed(2)}°`}
          </div>
          <div className="text-[11px] text-white/80">
            {bearingDeg == null
              ? ""
              : `${(toMils(bearingDeg, milsBase) ?? 0).toFixed(2)} mil`}
          </div>
        </div>

        {/* --- BLOCO 4: Distância --- */}
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
          <div className="text-[11px] text-white/70">Distância</div>
          <div className="text-xl font-semibold text-white">
            {distMeters == null ? "—" : `${distMeters.toFixed(0)} m`}
          </div>
          <div className="text-[11px] text-white/80">
            {distMeters == null
              ? ""
              : `${(distMeters / 1000).toFixed(3)} km`}
          </div>
        </div>
      </div>

      {/* Observação no rodapé */}
      <div className="text-[11px] text-white/80 mt-3">
        Obs.: Sítio/Elevação são geométricos (linha de visada).
      </div>
    </div>
  );
}
