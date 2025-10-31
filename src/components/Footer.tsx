// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-gray-800 via-[#3f4f2f] to-gray-800 border-t-4 border-red-600">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-300">
          <p className="tracking-wide font-semibold uppercase text-slate-200">
            ⚔️ SM Artilharia • Apoiar pelo Fogo!
          </p>
          <p className="mt-1">
            <span className="text-red-500 font-bold">105mm</span> • Elevação &amp; Deriva •
            <span className="text-blue-500 font-bold"> </span>
          </p>
          <p className="mt-1 text-slate-400">
            Linha de Pesquisa em Inteligência Computacional
          </p>
        </div>
      </footer>
    );
  }
  