import MapUtmDistance from "./MapUtmDistance";


export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-sans">

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-[#3f4f2f] to-gray-800 text-white shadow border-b-4 border-red-600">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
          <img
            src="/sm-artilharia-dots-icon.svg"
            alt="SM Artilharia Logo"
            className="w-28 h-28 mb-3"
            loading="eager"
          />
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center">
            SM Artilharia
          </h1>
          <p className="text-slate-300 mt-2 text-sm md:text-base font-medium text-center">
            Sistema de Cálculo de Elementos de Tiro • Obus 105 mm • 
          </p>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <MapUtmDistance />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-[#3f4f2f] to-gray-800 border-t-4 border-red-600">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-300">
          <p className="tracking-wide font-semibold uppercase text-slate-200">
            ⚔️ SM Artilharia • Precisão e Força
          </p>
          <p className="mt-1">
            <span className="text-red-500 font-bold">105mm</span> • Elevação & Deriva •
            <span className="text-blue-500 font-bold"> </span>
          </p>
          <p className="mt-1 text-slate-400">
            Desenvolvido com React + TypeScript + TailwindCSS
          </p>
        </div>
      </footer>

    </div>
  );
}
