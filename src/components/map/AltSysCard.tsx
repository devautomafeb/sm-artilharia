// Define o tipo das props esperadas pelo componente.
// Cada propriedade representa um valor e/ou função de atualização controlada por um estado pai.
type Props = {
  // Altitude do CB (provável ponto de cálculo de base)
  altCB: number | ""; 
  setAltCB: (v: number | "") => void;

  // Altitude do PV (provável ponto visado)
  altPV: number | "";
  setAltPV: (v: number | "") => void;

  // Sistema de mils (base angular usada em artilharia)
  milsBase: 6400 | 6000;
  setMilsBase: (v: 6400 | 6000) => void;

  // Diferença de altitude calculada entre PV e CB
  deltaH: number | null;
};

// Componente funcional que renderiza um card com campos de altitude e sistema angular
export default function AltSysCard({
  altCB,
  setAltCB,
  altPV,
  setAltPV,
  milsBase,
  setMilsBase,
  deltaH,
}: Props) {
  return (
    // Estrutura principal do card
    <div className="card p-4">
      {/* Título do card */}
      <div className="text-sm font-semibold mb-2">
        Altitudes (m) & Sistema
      </div>

      {/* Grid de 2 colunas para inputs organizados lado a lado */}
      <div className="grid grid-cols-2 gap-3">
        {/* Campo de entrada para altitude_CB */}
        <div>
          <div className="label">altitude_CB</div>
          <input
            className="input mt-1"
            type="number"
            placeholder="ex: 120"
            value={altCB}
            // Quando o valor muda, converte o texto em número (ou vazio)
            onChange={(e) =>
              setAltCB(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        {/* Campo de entrada para altitude_PV */}
        <div>
          <div className="label">altitude_PV</div>
          <input
            className="input mt-1"
            type="number"
            placeholder="ex: 85"
            value={altPV}
            onChange={(e) =>
              setAltPV(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        {/* Seletor de sistema de mils */}
        <div className="col-span-2">
          <div className="label">Sistema de mils</div>
          <select
            className="select mt-1 w-full"
            value={milsBase}
            onChange={(e) =>
              setMilsBase(Number(e.target.value) as 6400 | 6000)
            }
          >
            <option value={6400}>6400 mil</option>
            <option value={6000}>6000 mil</option>
          </select>
        </div>
      </div>

      {/* Exibe Δh (diferença de altitude) se existir */}
      {deltaH != null && (
        <div className="mt-2 text-xs text-slate-600">
          Δh (PV − CB): <b>{deltaH.toFixed(2)} m</b>
        </div>
      )}
    </div>
  );
}
