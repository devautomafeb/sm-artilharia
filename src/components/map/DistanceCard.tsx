// Componente que exibe a distância calculada entre dois pontos no mapa
export default function DistanceCard({
  distMeters, // recebe a distância em metros (ou null, se ainda não houver)
}: {
  // Tipagem das props recebidas pelo componente:
  // - distMeters: número (em metros) ou null quando não calculado
  distMeters: number | null;
}) {

  // Define o texto que será mostrado no card.
  // Se distMeters for null → mostra apenas um traço "-"
  // Caso contrário → mostra o valor formatado em metros e quilômetros.
  const text =
    distMeters == null
      ? "-" // caso ainda não exista distância calculada
      : `${distMeters.toFixed(2)} m (${(distMeters / 1000).toFixed(3)} km)`; 
      // formata para duas casas decimais em metros e três em quilômetros

  return (
    // Container principal do card
    // - "card": classe base visual do componente (provável estilização própria)
    // - "p-4": padding interno para espaçamento
    <div className="card p-4">
      
      {/* Título do card: indica o que está sendo exibido */}
      <div className="text-sm font-semibold text-slate-700 mb-2">
        Distância
      </div>

      {/* Exibe o valor calculado ou "-" se ainda não houver */}
      <div className="text-lg font-semibold">
        {text}
      </div>

      {/* Rodapé informativo, indicando o método de cálculo usado */}
      <div className="text-xs text-slate-500 mt-1">
        Geodésica por Haversine.
      </div>
    </div>
  );
}
