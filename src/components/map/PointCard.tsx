// Define o tipo das propriedades esperadas pelo componente.
type Props = {
  title: string;                        // Título exibido no topo do card (ex: "Ponto 1")
  activeBadge?: boolean;                // Define se o ponto está ativo (exibe selo "ativo")
  activeLabel?: string;                 // Texto opcional para o selo (substitui "ativo")
  name: string;                         // Nome do ponto (controlado por input)
  onNameChange: (v: string) => void;    // Callback chamada ao mudar o nome do ponto
  iconSize: number;                     // Tamanho atual do ícone no mapa (em px)
  onIconSizeChange: (n: number) => void;// Callback chamada ao ajustar o tamanho do ícone
};

// Componente PointCard
// Serve para editar propriedades visuais e de identificação de um ponto (ex: nome e tamanho do ícone)
export default function PointCard({
  title,
  activeBadge,
  activeLabel,
  name,
  onNameChange,
  iconSize,
  onIconSizeChange,
}: Props) {
  return (
    // Estrutura principal do card
    <div className="card p-4">
      
      {/* Cabeçalho do card com título e selo de status */}
      <div className="flex items-center justify-between mb-2">
        {/* Título do ponto (ex: "Ponto 1" ou "Ponto Visado") */}
        <div className="text-sm font-semibold">{title}</div>

        {/* Selo de "ativo" mostrado somente se activeBadge for true */}
        {activeBadge && (
          <span
            className={`pill ${
              activeBadge ? "bg-blue-600 text-white" : ""
            }`}
          >
            {/* Se houver activeLabel, usa esse texto; senão, exibe "ativo" */}
            {activeLabel ?? "ativo"}
          </span>
        )}
      </div>

      {/* Grade com inputs de edição */}
      <div className="grid grid-cols-2 gap-3">

        {/* Campo de texto: nome do ponto */}
        <div>
          <div className="label">Nome</div>
          <input
            className="input mt-1"
            value={name}
            onChange={(e) => onNameChange(e.target.value)} // Atualiza o estado do nome no componente pai
          />
        </div>

        {/* Controle deslizante: tamanho do ícone */}
        <div className="col-span-2">
          {/* Rótulo com valor atual do tamanho */}
          <div className="label">
            Tamanho ícone: <b>{iconSize}px</b>
          </div>

          {/* Range input (slider) para alterar o tamanho do ícone entre 16 e 96px */}
          <input
            type="range"
            min={16}
            max={96}
            step={1}
            value={iconSize}
            onChange={(e) => onIconSizeChange(Number(e.target.value))} // Chama callback de atualização
            className="w-full accent-blue-600 mt-1" // estilo azul para o controle
          />
        </div>
      </div>
    </div>
  );
}
