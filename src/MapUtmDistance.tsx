import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  LayersControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import L from 'leaflet';
import proj4 from 'proj4';

// ===== ÍCONES LOCAIS =====
import BiaMrt120 from "../assets/BiaMrt120.png";
import BiaO105 from "../assets/BiaO105.png";
import CiaIMtz from "../assets/CiaIMtz.png";
import IniBtlMtz from "../assets/IniBtlMtz.png";
import IniCiaCC from "../assets/IniCiaCC.png";
import IniCiaInfMec from "../assets/IniCiaInfMec.png";
import IniCiaMec from "../assets/IniCiaMec.png";
import IniCiaMtz from "../assets/IniCiaMtz.png";
import IniPelMtzIni from "../assets/IniPelMtzIni.png";
import PelIMtz from "../assets/PelIMtz.png";
import PelInf from "../assets/PelInf.png";
import Target from "../assets/target.png";

const ICONS = {
  PelIMtz,
  CiaIMtz,
  PelInf,
  IniBtlMtz,
  IniCiaCC,
  IniCiaInfMec,
  IniCiaMec,
  IniCiaMtz,
  IniPelMtzIni,
  BiaO105,
  BiaMrt120,
  PV: Target,
  Target,
} as const;
type IconKey = keyof typeof ICONS;

// ===== Tipos =====
export type UtmCoord = {
  zone: number;
  hemisphere: 'N' | 'S';
  easting: number | string;
  northing: number | string;
};
export type LatLng = { lat: number; lng: number };

// ===== Conversões UTM <-> WGS84 =====
function utmToLatLng({ zone, hemisphere, easting, northing }: UtmCoord): LatLng | null {
  if (!zone || easting === '' || northing === '') return null;
  const southFlag = hemisphere?.toUpperCase().startsWith('S');
  const utmProj = `+proj=utm +zone=${zone} ${southFlag ? '+south ' : ''}+datum=WGS84 +units=m +no_defs`;
  const [lng, lat] = proj4(utmProj, 'WGS84', [Number(easting), Number(northing)]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}
function latLngToUtm({ lat, lng }: LatLng): UtmCoord {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const hemisphere: 'N' | 'S' = lat < 0 ? 'S' : 'N';
  const utmProj = `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south ' : ''}+datum=WGS84 +units=m +no_defs`;
  const [easting, northing] = proj4('WGS84', utmProj, [lng, lat]);
  return {
    zone,
    hemisphere,
    easting: Number((easting as number).toFixed(3)),
    northing: Number((northing as number).toFixed(3)),
  };
}

// ===== Distância (Haversine) =====
function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ===== Azimute inicial (P1 -> P2) =====
function initialBearingDegrees(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lng - a.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const deg = (toDeg(θ) + 360) % 360;
  return deg;
}

const defaultCenter: LatLng = { lat: -23.5505, lng: -46.6333 };

// ===== Fit bounds =====
function FitBounds({ p1, p2, padding = 80 }: { p1?: LatLng | null; p2?: LatLng | null; padding?: number }) {
  const map = useMap();
  useEffect(() => {
    if (p1 && p2) {
      const bounds: LatLngBoundsExpression = [
        [p1.lat, p1.lng],
        [p2.lat, p2.lng],
      ];
      map.fitBounds(bounds, { padding: [padding, padding] });
    }
  }, [p1?.lat, p1?.lng, p2?.lat, p2?.lng, map, padding]);
  return null;
}

// ===== Clique: define P1/P2 =====
function ClickCapture({ onPick }: { active: 'p1' | 'p2'; onPick: (utm: UtmCoord) => void }) {
  useMapEvents({
    click(e) {
      const utm = latLngToUtm({ lat: e.latlng.lat, lng: e.latlng.lng });
      onPick(utm);
    },
  });
  return null;
}

// ===== Ícone Leaflet =====
function useLfIcon(imageUrl: string, sizePx: number) {
  return useMemo(() => {
    const s = Math.max(16, Math.round(sizePx));
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [s, s],
      iconAnchor: [Math.round(s / 2), s],
      popupAnchor: [0, -s + 8],
      className: 'shadow-none',
    });
  }, [imageUrl, sizePx]);
}

// ===== Mantém o select externo em sincronia com o LayersControl =====
function LayerSync({
  baseMap,
  onBaseMapChange,
}: {
  baseMap: 'roadmap' | 'terrain' | 'satellite';
  onBaseMapChange: (b: 'roadmap' | 'terrain' | 'satellite') => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handleBaselayerChange = (e: any) => {
      const name: string = e.name || '';
      if (name.includes('OpenStreetMap')) onBaseMapChange('roadmap');
      else if (name.includes('OpenTopoMap')) onBaseMapChange('terrain');
      else if (name.includes('Esri')) onBaseMapChange('satellite');
    };
    map.on('baselayerchange', handleBaselayerChange);
    return () => {
      map.off('baselayerchange', handleBaselayerChange);
    };
  }, [map, onBaseMapChange, baseMap]);
  return null;
}

// ===== COMPONENTE PRINCIPAL =====
export default function MapUtmDistanceLeaflet() {
  // Pontos em UTM
  const [utm1, setUtm1] = useState<UtmCoord>({ zone: 23, hemisphere: 'S', easting: '', northing: '' });
  const [utm2, setUtm2] = useState<UtmCoord>({ zone: 23, hemisphere: 'S', easting: '', northing: '' });

  // Nomes/ícones/tamanhos
  const [name1, setName1] = useState('Ponto 1');
  const [name2, setName2] = useState('Ponto 2');
  const [iconKey1, setIconKey1] = useState<IconKey>('PelIMtz');
  const [iconKey2, setIconKey2] = useState<IconKey>('CiaIMtz');
  const [iconSize1, setIconSize1] = useState(40);
  const [iconSize2, setIconSize2] = useState(40);

  // Tipo de mapa
  type BaseMap = 'roadmap' | 'terrain' | 'satellite';
  const [baseMap, setBaseMap] = useState<BaseMap>('satellite');

  // Alvo do clique
  const [activeTarget, setActiveTarget] = useState<'p1' | 'p2'>('p1');

  // Altitudes e parâmetros simplificados
  const [altCB, setAltCB] = useState<number | ''>(''); // altitude da peça (m)
  const [altPV, setAltPV] = useState<number | ''>(''); // altitude do alvo (m)
  const [milsBase, setMilsBase] = useState<6400 | 6000>(6400);

  // Conversões p/ lat/lng
  const p1 = useMemo(() => utmToLatLng(utm1), [utm1]);
  const p2 = useMemo(() => utmToLatLng(utm2), [utm2]);

  // Distância geodésica
  const distMeters: number | null = useMemo(() => (p1 && p2 ? haversineMeters(p1, p2) : null), [p1, p2]);
  const distKm = distMeters ? distMeters / 1000 : null;

  // Δh e Sítio / Elevação geométrica (LSV)
  const deltaH = useMemo(() => {
    if (altCB === '' || altPV === '' || distMeters == null) return null;
    return Number(altPV) - Number(altCB); // PV - CB
  }, [altCB, altPV, distMeters]);

  const siteDeg = useMemo(() => {
    if (deltaH == null || distMeters == null || distMeters === 0) return null;
    return (Math.atan2(deltaH, distMeters) * 180) / Math.PI;
  }, [deltaH, distMeters]);

  const toMils = (deg: number | null) => (deg == null ? null : (deg * milsBase) / 360);

  // Direção (azimute) P1->P2
  const bearingDeg = useMemo(() => (p1 && p2 ? initialBearingDegrees(p1, p2) : null), [p1, p2]);

  // Deriva estimada (mantemos o cálculo básico para o overlay)
  const coefDerivaMilPorKm = 1.5;
  const driftMil = useMemo(() => {
    if (distKm == null) return null;
    return coefDerivaMilPorKm * distKm;
  }, [distKm]);

  const formatMeters = (m: number | null) =>
    (m == null ? '-' : `${m.toFixed(2)} m (${(m / 1000).toFixed(3)} km)`);

  const markerIcon1 = useLfIcon(ICONS[iconKey1], iconSize1);
  const markerIcon2 = useLfIcon(ICONS[iconKey2], iconSize2);
  const iconOptions = Object.keys(ICONS) as IconKey[];

  const center: LatLng = p1 || p2 || defaultCenter;

  const handlePick = (utm: UtmCoord) => {
    if (activeTarget === 'p1') setUtm1(utm);
    else setUtm2(utm);
  };

  return (
    <div className="space-y-6">
      {/* Linha de ações principais */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Alvo do clique (no topo, como antes) */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">Definir ponto pelo clique</div>
            <span className="pill">WGS84 • UTM</span>
          </div>
          <div className="mt-3 inline-flex overflow-hidden rounded-2xl border border-slate-300 bg-white">
            <button
              onClick={() => setActiveTarget('p1')}
              className={`btn-toggle ${activeTarget === 'p1' ? 'btn-toggle-active' : 'btn-toggle-idle'}`}
            >
              Ponto 1
            </button>
            <button
              onClick={() => setActiveTarget('p2')}
              className={`btn-toggle ${activeTarget === 'p2' ? 'btn-toggle-active' : 'btn-toggle-idle'}`}
            >
              Ponto 2
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Clique no mapa para posicionar o ponto ativo. Você pode ajustar manualmente depois.
          </p>
        </div>

        {/* Tipo de mapa */}
        <div className="card p-4">
          <div className="label">Tipo de mapa</div>
          <select className="select mt-1" value={baseMap} onChange={(e) => setBaseMap(e.target.value as BaseMap)}>
            <option value="roadmap">OpenStreetMap (Roadmap)</option>
            <option value="terrain">OpenTopoMap (Terrain)</option>
            <option value="satellite">Esri WorldImagery (Satellite)</option>
          </select>
          <div className="mt-3 text-xs text-slate-500">
            Padrão: satélite (Esri WorldImagery). Respeite as atribuições.
          </div>
        </div>

        {/* Distância (card auxiliar) */}
        <div className="card p-4">
          <div className="text-sm font-semibold text-slate-700 mb-2">Distância</div>
          <div className="text-lg font-semibold">{formatMeters(distMeters)}</div>
          <div className="text-xs text-slate-500 mt-1">Geodésica por Haversine.</div>
        </div>
      </div>

      {/* Parâmetros de Altitude + Sistema de mils */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm font-semibold mb-2">Altitudes (m) & Sistema</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="label">altitude_CB</div>
              <input
                className="input mt-1"
                type="number"
                placeholder="ex: 120"
                value={altCB}
                onChange={(e) => setAltCB(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <div className="label">altitude_PV</div>
              <input
                className="input mt-1"
                type="number"
                placeholder="ex: 85"
                value={altPV}
                onChange={(e) => setAltPV(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <div className="label">Sistema de mils</div>
              <select
                className="select mt-1 w-full"
                value={milsBase}
                onChange={(e) => setMilsBase(Number(e.target.value) as 6400 | 6000)}
              >
                <option value={6400}>6400 mil</option>
                <option value={6000}>6000 mil</option>
              </select>
            </div>
          </div>
          {deltaH != null && (
            <div className="mt-2 text-xs text-slate-600">
              Δh (PV − CB): <b>{deltaH.toFixed(2)} m</b>
            </div>
          )}
        </div>

        {/* Saídas — tema verde-oliva */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-4 border shadow"
               style={{ background: 'linear-gradient(135deg, #556B2F 0%, #3d4d24 100%)', borderColor: '#495c27' }}>
            <div className="text-sm font-semibold text-white/90 mb-3">Saídas</div>

            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
              {/* Elevação */}
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
                <div className="text-[11px] text-white/70">Elevação (geom.)</div>
                <div className="text-xl font-semibold text-white">
                  {siteDeg == null ? '—' : `${siteDeg.toFixed(3)}°`}
                </div>
                <div className="text-[11px] text-white/80">
                  {siteDeg == null ? '' : `${(toMils(siteDeg) ?? 0).toFixed(2)} mil`}
                </div>
              </div>

              {/* Deriva (estim.) */}
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
                <div className="text-[11px] text-white/70">Deriva (estim.)</div>
                <div className="text-xl font-semibold text-white">
                  {driftMil == null ? '—' : `${driftMil.toFixed(2)} mil`}
                </div>
                <div className="text-[11px] text-white/80">sentido → direita</div>
              </div>

              {/* Direção */}
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
                <div className="text-[11px] text-white/70">Direção (azimute)</div>
                <div className="text-xl font-semibold text-white">
                  {bearingDeg == null ? '—' : `${bearingDeg.toFixed(2)}°`}
                </div>
                <div className="text-[11px] text-white/80">
                  {bearingDeg == null ? '' : `${(toMils(bearingDeg) ?? 0).toFixed(2)} mil`}
                </div>
              </div>

              {/* Distância (resumo) */}
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 p-3 text-center">
                <div className="text-[11px] text-white/70">Distância</div>
                <div className="text-xl font-semibold text-white">
                  {distMeters == null ? '—' : `${distMeters.toFixed(0)} m`}
                </div>
                <div className="text-[11px] text-white/80">
                  {distMeters == null ? '' : `${(distMeters / 1000).toFixed(3)} km`}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-white/80 mt-3">
              Observação: Elevação/Sítio são geométricos (linha de visada). QE balístico depende de tábuas/condições reais.
            </div>
          </div>
        </div>
      </div>

      {/* Legenda + Ícones */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Ponto 1 */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Ponto 1</div>
            <span className={`pill ${activeTarget === 'p1' ? 'bg-blue-600 text-white' : ''}`}>clique → P1</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="label">Nome</div>
              <input className="input mt-1" value={name1} onChange={(e) => setName1(e.target.value)} />
            </div>
            <div>
              <div className="label">Ícone</div>
              <div className="mt-1 grid grid-cols-[1fr,48px] gap-2">
                <select className="select" value={iconKey1} onChange={(e) => setIconKey1(e.target.value as IconKey)}>
                  {(Object.keys(ICONS) as IconKey[]).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <div className="grid place-items-center rounded-xl border border-slate-200 bg-white">
                  <img src={ICONS[iconKey1]} alt="" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="label">Tamanho ícone: <b>{iconSize1}px</b></div>
              <input
                type="range"
                min={16}
                max={96}
                step={1}
                value={iconSize1}
                onChange={(e) => setIconSize1(Number(e.target.value))}
                className="w-full accent-blue-600 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Ponto 2 */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Ponto 2</div>
            <span className={`pill ${activeTarget === 'p2' ? 'bg-blue-600 text-white' : ''}`}>clique → P2</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="label">Nome</div>
              <input className="input mt-1" value={name2} onChange={(e) => setName2(e.target.value)} />
            </div>
            <div>
              <div className="label">Ícone</div>
              <div className="mt-1 grid grid-cols-[1fr,48px] gap-2">
                <select className="select" value={iconKey2} onChange={(e) => setIconKey2(e.target.value as IconKey)}>
                  {(Object.keys(ICONS) as IconKey[]).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <div className="grid place-items-center rounded-xl border border-slate-200 bg-white">
                  <img src={ICONS[iconKey2]} alt="" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="label">Tamanho ícone: <b>{iconSize2}px</b></div>
              <input
                type="range"
                min={16}
                max={96}
                step={1}
                value={iconSize2}
                onChange={(e) => setIconSize2(Number(e.target.value))}
                className="w-full accent-blue-600 mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Formulários UTM */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* UTM P1 */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-2">Ponto 1 (UTM)</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="label">Zona</div>
              <input className="input mt-1" type="number" min={1} max={60} value={utm1.zone}
                     onChange={(e) => setUtm1((s) => ({ ...s, zone: Number(e.target.value) }))} />
            </div>
            <div>
              <div className="label">Hemisfério</div>
              <select className="select mt-1" value={utm1.hemisphere}
                      onChange={(e) => setUtm1((s) => ({ ...s, hemisphere: e.target.value as 'N' | 'S' }))}>
                <option value="N">N</option>
                <option value="S">S</option>
              </select>
            </div>
            <div>
              <div className="label">Easting (m)</div>
              <input className="input mt-1" type="number" placeholder="ex: 345000" value={utm1.easting}
                     onChange={(e) => setUtm1((s) => ({ ...s, easting: e.target.value }))} />
            </div>
            <div>
              <div className="label">Northing (m)</div>
              <input className="input mt-1" type="number" placeholder="ex: 7400000" value={utm1.northing}
                     onChange={(e) => setUtm1((s) => ({ ...s, northing: e.target.value }))} />
            </div>
          </div>
          {p1 && (
            <div className="mt-2 text-xs text-slate-600">
              Lat/Lng: <b>{p1.lat.toFixed(6)}</b>, <b>{p1.lng.toFixed(6)}</b>
            </div>
          )}
        </div>

        {/* UTM P2 */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-2">Ponto 2 (UTM)</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="label">Zona</div>
              <input className="input mt-1" type="number" min={1} max={60} value={utm2.zone}
                     onChange={(e) => setUtm2((s) => ({ ...s, zone: Number(e.target.value) }))} />
            </div>
            <div>
              <div className="label">Hemisfério</div>
              <select className="select mt-1" value={utm2.hemisphere}
                      onChange={(e) => setUtm2((s) => ({ ...s, hemisphere: e.target.value as 'N' | 'S' }))}>
                <option value="N">N</option>
                <option value="S">S</option>
              </select>
            </div>
            <div>
              <div className="label">Easting (m)</div>
              <input className="input mt-1" type="number" placeholder="ex: 355000" value={utm2.easting}
                     onChange={(e) => setUtm2((s) => ({ ...s, easting: e.target.value }))} />
            </div>
            <div>
              <div className="label">Northing (m)</div>
              <input className="input mt-1" type="number" placeholder="ex: 7410000" value={utm2.northing}
                     onChange={(e) => setUtm2((s) => ({ ...s, northing: e.target.value }))} />
            </div>
          </div>
          {p2 && (
            <div className="mt-2 text-xs text-slate-600">
              Lat/Lng: <b>{p2.lat.toFixed(6)}</b>, <b>{p2.lng.toFixed(6)}</b>
            </div>
          )}
        </div>
      </div>

      {/* Mapa + overlays */}
      <div className="card overflow-hidden h-screen relative">
        {/* Overlay centralizado no topo (resumo) — com Distância */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl bg-white/90 backdrop-blur px-4 py-2 border border-slate-200 shadow">
          <div className="text-[11px] text-slate-500 text-center">Resumo (tempo real)</div>
          <div className="mt-0.5 flex items-center gap-3 text-sm whitespace-nowrap">
            <span>
              <b>Elevação:</b>{' '}
              {siteDeg == null ? '-' : `${siteDeg.toFixed(3)}°  |  ${(toMils(siteDeg) ?? 0).toFixed(2)} mil`}
            </span>
            <span className="opacity-40">|</span>
            <span>
              <b>Deriva:</b>{' '}
              {driftMil == null ? '-' : `${driftMil.toFixed(2)} mil → direita`}
            </span>
            <span className="opacity-40">|</span>
            <span>
              <b>DGT:</b>{' '}
              {bearingDeg == null ? '-' : `${bearingDeg.toFixed(2)}°  |  ${(toMils(bearingDeg) ?? 0).toFixed(2)} mil`}
            </span>
            <span className="opacity-40">|</span>
            <span>
              <b>Distância:</b>{' '}
              {distMeters == null ? '-' : `${distMeters.toFixed(2)} m  (${(distMeters / 1000).toFixed(3)} km)`}
            </span>
          </div>
        </div>

        {/* Controle compacto dentro do mapa: alternar P1/P2 (inferior-direita) */}
        <div className="absolute bottom-3 right-3 z-[1000] rounded-xl bg-white/95 backdrop-blur px-2 py-1 border border-slate-200 shadow">
          <div className="flex items-center gap-2">
            <span className="pill text-[10px] px-2 py-[2px]">WGS84 • UTM</span>
            <div className="inline-flex overflow-hidden rounded-xl border border-slate-300 bg-white">
              <button
                onClick={() => setActiveTarget('p1')}
                className={`btn-toggle ${activeTarget === 'p1' ? 'btn-toggle-active' : 'btn-toggle-idle'} text-xs px-2 py-1`}
                title="Definir Ponto 1 pelo clique"
              >
                P1
              </button>
              <button
                onClick={() => setActiveTarget('p2')}
                className={`btn-toggle ${activeTarget === 'p2' ? 'btn-toggle-active' : 'btn-toggle-idle'} text-xs px-2 py-1`}
                title="Definir Ponto 2 pelo clique"
              >
                P2
              </button>
            </div>
          </div>
        </div>

        <MapContainer
          center={[ (p1?.lat ?? p2?.lat ?? defaultCenter.lat), (p1?.lng ?? p2?.lng ?? defaultCenter.lng) ]}
          zoom={5}
          style={{ width: '100%', height: '100vh', cursor: 'pointer' }}
          doubleClickZoom={false}
          zoomControl={true}
          attributionControl={true}
        >
          {/* Camadas base */}
          <LayersControl position="topright" key={baseMap}>
            <LayersControl.BaseLayer checked={baseMap === 'roadmap'} name="OpenStreetMap (Roadmap)">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked={baseMap === 'terrain'} name="OpenTopoMap (Terrain)">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked={baseMap === 'satellite'} name="Esri WorldImagery (Satellite)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Sincroniza select externo com LayersControl */}
          <LayerSync baseMap={baseMap} onBaseMapChange={setBaseMap} />

          {/* Clique define P1 ou P2 */}
          <ClickCapture active={activeTarget} onPick={handlePick} />

          {/* Fit bounds quando ambos existem */}
          <FitBounds p1={p1 ?? undefined} p2={p2 ?? undefined} padding={80} />

          {/* Markers e Popups */}
          {p1 && (
            <Marker position={[p1.lat, p1.lng]} icon={markerIcon1}>
              <Popup closeButton={false} autoPan={false}>
                <div className="text-xs">{name1}</div>
              </Popup>
            </Marker>
          )}
          {p2 && (
            <Marker position={[p2.lat, p2.lng]} icon={markerIcon2}>
              <Popup closeButton={false} autoPan={false}>
                <div className="text-xs">{name2}</div>
              </Popup>
            </Marker>
          )}

          {/* Linha entre pontos */}
          {p1 && p2 && (
            <Polyline
              positions={[[p1.lat, p1.lng], [p2.lat, p2.lng]]}
              pathOptions={{ opacity: 0.9, weight: 4 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
