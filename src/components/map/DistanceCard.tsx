export default function DistanceCard({ distMeters }: { distMeters: number | null }) {
  const text = distMeters == null ? "-" : `${distMeters.toFixed(2)} m (${(distMeters / 1000).toFixed(3)} km)`;
  return (
    <div className="card p-4">
      <div className="text-sm font-semibold text-slate-700 mb-2">Distância</div>
      <div className="text-lg font-semibold">{text}</div>
      <div className="text-xs text-slate-500 mt-1">Geodésica por Haversine.</div>
    </div>
  );
}
