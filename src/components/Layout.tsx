// src/components/Layout.tsx
// Importa o tipo ReactNode, que representa qualquer conteúdo React válido (elementos, texto, fragmentos, etc.)
import type { ReactNode } from "react";

// Importa os componentes de cabeçalho e rodapé
import Header from "./Header";
import Footer from "./Footer";

// Define o tipo das props esperadas pelo componente Layout.
// O componente espera receber um filho (children), que será o conteúdo da página.
type LayoutProps = {
  children: ReactNode;
};

// Define o componente Layout, que serve como estrutura base (template) das páginas.
export default function Layout({ children }: LayoutProps) {
  return (
    // A div principal define o layout de toda a página.
    // min-h-dvh → faz com que o layout ocupe no mínimo toda a altura da viewport dinâmica.
    // flex flex-col → organiza os elementos verticalmente (coluna).
    // bg-slate-50 → define um fundo claro.
    // text-slate-900 → define a cor do texto como cinza-escuro.
    // font-sans → usa uma fonte sem serifa padrão.
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Cabeçalho fixo no topo da página */}
      <Header />

      {/* Área principal onde o conteúdo dinâmico das páginas será exibido */}
      {/* flex-1 → ocupa o espaço restante entre o Header e o Footer */}
      {/* max-w-6xl w-full mx-auto → limita a largura máxima e centraliza o conteúdo */}
      {/* px-4 py-6 → adiciona espaçamento interno (padding) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Rodapé fixo na parte inferior da página */}
      <Footer />
    </div>
  );
}
