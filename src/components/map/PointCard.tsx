type Props = {
  title: string;
  activeBadge?: boolean;
  activeLabel?: string;
  name: string;
  onNameChange: (v: string) => void;
  iconSize: number;
  onIconSizeChange: (n: number) => void;
};

export default function PointCard({ title, activeBadge, activeLabel, name, onNameChange, iconSize, onIconSizeChange }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{title}</div>
        {activeBadge && <span className={`pill ${activeBadge ? "bg-blue-600 text-white" : ""}`}>{activeLabel ?? "ativo"}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="label">Nome</div>
          <input className="input mt-1" value={name} onChange={(e) => onNameChange(e.target.value)} />
        </div>
        <div className="col-span-2">
          <div className="label">Tamanho ícone: <b>{iconSize}px</b></div>
          <input type="range" min={16} max={96} step={1} value={iconSize}
                 onChange={(e) => onIconSizeChange(Number(e.target.value))}
                 className="w-full accent-blue-600 mt-1" />
        </div>
      </div>
    </div>
  );
}
