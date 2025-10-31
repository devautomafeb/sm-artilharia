// Importa a função de conversão de coordenadas e o tipo UtmCoord
// - utmToLatLng: converte coordenadas UTM → latitude/longitude
// - UtmCoord: tipo que representa uma coordenada no sistema UTM
import { utmToLatLng, type UtmCoord } from "../../functions/geo";

// Componente UtmForm
// Exibe um formulário para editar uma coordenada UTM (zona, hemisfério, easting e northing)
// e mostra a conversão automática para latitude/longitude.
export default function UtmForm({
  title, // título do formulário (ex: "Ponto 1" ou "Ponto 2")
  utm,   // objeto contendo os dados UTM atuais
  setUtm // função callback para atualizar a coordenada UTM
}: {
  title: string;
  utm: UtmCoord;
  setUtm: (u: UtmCoord) => void;
}) {

  // Converte a coordenada UTM atual para latitude/longitude
  // A cada renderização, atualiza a conversão conforme o usuário edita os campos
  const p = utmToLatLng(utm);

  return (
    // Container principal do formulário (estilizado como card)
    <div className="card p-4">
      
      {/* Cabeçalho do card com o título fornecido por props */}
      <div className="text-sm font-semibold mb-2">{title}</div>

      {/* Layout em grade (2 colunas) para organizar os campos de entrada */}
      <div className="grid grid-cols-2 gap-3">

        {/* Campo 1 — Zona UTM (número entre 1 e 60) */}
        <div>
          <div className="label">Zona</div>
          <input
            className="input mt-1"
            type="number"
            min={1}
            max={60}
            value={utm.zone}
            onChange={(e) => setUtm({ ...utm, zone: Number(e.target.value) })}
          />
        </div>

        {/* Campo 2 — Hemisfério (Norte ou Sul) */}
        <div>
          <div className="label">Hemisfério</div>
          <select
            className="select mt-1"
            value={utm.hemisphere}
            onChange={(e) =>
              setUtm({ ...utm, hemisphere: e.target.value as "N" | "S" })
            }
          >
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>

        {/* Campo 3 — Easting (coordenada Leste em metros) */}
        <div>
          <div className="label">Easting (m)</div>
          <input
            className="input mt-1"
            type="number"
            placeholder="ex: 345000"
            value={utm.easting}
            onChange={(e) => setUtm({ ...utm, easting: e.target.value })}
          />
        </div>

        {/* Campo 4 — Northing (coordenada Norte em metros) */}
        <div>
          <div className="label">Northing (m)</div>
          <input
            className="input mt-1"
            type="number"
            placeholder="ex: 7400000"
            value={utm.northing}
            onChange={(e) => setUtm({ ...utm, northing: e.target.value })}
          />
        </div>
      </div>

      {/* Mostra a conversão UTM → Lat/Lng, se a conversão for válida */}
      {p && (
        <div className="mt-2 text-xs text-slate-600">
          Lat/Lng: <b>{p.lat.toFixed(6)}</b>, <b>{p.lng.toFixed(6)}</b>
        </div>
      )}
    </div>
  );
}
