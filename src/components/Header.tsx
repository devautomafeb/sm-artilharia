// src/components/Header.tsx
export default function Header() {
    return (
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
    );
  }
  