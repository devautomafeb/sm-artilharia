// src/components/map/TopSummary.tsx

// Importa o tipo ReactNode, usado para permitir que o componente aceite qualquer conteúdo React válido como filho.
import type { ReactNode } from "react";

// Componente genérico TopSummary
// Serve como um contêiner visual flutuante (HUD) posicionado no topo do mapa,
// que pode envolver qualquer conteúdo fornecido via children.
export default function TopSummary({ children }: { children: ReactNode }) {
  return (
    // Container principal posicionado de forma absoluta sobre o mapa.
    // - top-3: distância do topo (margem superior)
    // - left-1/2 + -translate-x-1/2: centraliza horizontalmente
    // - z-[1000]: garante que o elemento fique acima das camadas do mapa
    // - rounded-2xl + border + shadow: bordas suaves e sombra discreta
    // - bg-white/90 + backdrop-blur: fundo branco translúcido com leve desfoque
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-slate-200 shadow">
      {/* Renderiza o conteúdo passado como filho (qualquer JSX) */}
      {children}
    </div>
  );
}
