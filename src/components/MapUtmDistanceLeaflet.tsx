import { useMemo, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// === Imports do seu projeto (mantidos exatamente como no original) ===
import FitBounds from "./map/FitBounds";
import ClickCapture from "./map/ClickCapture";
import LayerSync, { type BaseMap } from "./map/LayerSync";
import PointCard from "./map/PointCard";
import OutputsPanel from "./map/OutputsPanel";

import ActionClickCard from "./map/ActionClickCard";
import BaseMapCard from "./map/BaseMapCard";
import DistanceCard from "./map/DistanceCard";
import AltSysCard from "./map/AltSysCard";
import UtmForm from "./map/UtmForm";
import MapHud from "./map/MapHud";
import MapPointControls from "./map/MapPointControls";
import MarkersLayer from "./map/MarkersLayer";
import RouteLine from "./map/RouteLine";

// === Funções e tipos auxiliares (mantidos como no original) ===
import {
  utmToLatLng,
  haversineMeters,
  initialBearingDegrees,
  toMils,
  type UtmCoord,
  type LatLng,
} from "../functions/geo";

// Centro padrão (São Paulo)
const defaultCenter: LatLng = { lat: -23.5505, lng: -46.6333 };

export default function MapUtmDistanceLeaflet() {
  // ------------------------------
  // Pontos UTM (estado controlado)
  // ------------------------------
  const [utm1, setUtm1] = useState<UtmCoord>({ zone: 23, hemisphere: "S", easting: "", northing: "" });
  const [utm2, setUtm2] = useState<UtmCoord>({ zone: 23, hemisphere: "S", easting: "", northing: "" });

  // Metadados dos pontos (nome e tamanho do ícone)
  const [name1, setName1] = useState("Ponto 1");
  const [name2, setName2] = useState("Ponto 2");
  const [iconSize1, setIconSize1] = useState(40);
  const [iconSize2, setIconSize2] = useState(40);

  // Controle do mapa: tipo de base e alvo ativo para clique
  const [baseMap, setBaseMap] = useState<BaseMap>("satellite");
  const [activeTarget, setActiveTarget] = useState<"p1" | "p2">("p1");

  // Altitudes (CB/PV) e sistema de mils
  const [altCB, setAltCB] = useState<number | "">("");
  const [altPV, setAltPV] = useState<number | "">("");
  const [milsBase, setMilsBase] = useState<6400 | 6000>(6400);

  // Conversão UTM -> LatLng (recalcula quando utm1/utm2 mudam)
  const p1 = useMemo(() => utmToLatLng(utm1), [utm1]);
  const p2 = useMemo(() => utmToLatLng(utm2), [utm2]);

  // Métricas derivadas
  const distMeters = useMemo(() => (p1 && p2 ? haversineMeters(p1, p2) : null), [p1, p2]);

  const deltaH = useMemo(() => {
    if (altCB === "" || altPV === "" || distMeters == null) return null;
    return Number(altPV) - Number(altCB);
  }, [altCB, altPV, distMeters]);

  const siteDeg = useMemo(() => {
    if (deltaH == null || distMeters == null || distMeters === 0) return null;
    return (Math.atan2(deltaH, distMeters) * 180) / Math.PI;
  }, [deltaH, distMeters]);

  const bearingDeg = useMemo(() => (p1 && p2 ? initialBearingDegrees(p1, p2) : null), [p1, p2]);

  // Drift (placeholder) — ajuste com seu modelo real se necessário
// Drift normalizada para o intervalo [2800, 3200]
const driftMil = useMemo(() => {
  if (!distMeters) return null;

  // Cálculo base (pode ser substituído por seu modelo real)
  const baseDrift = 1.5 * (distMeters / 1000);

  // Normalização linear:
  // primeiro, definimos um intervalo de entrada estimado (ex: 0 a 10 mil)
  const minInput = 0;
  const maxInput = 10; // km — ajuste se necessário conforme o alcance real

  // Limitamos o valor base ao intervalo de entrada
  const clamped = Math.min(Math.max(baseDrift, minInput), maxInput);

  // Mapeamos o valor para o intervalo [2800, 3200]
  const normalized = 2800 + ((clamped - minInput) / (maxInput - minInput)) * (3200 - 2800);

  return normalized;
}, [distMeters]);


  // Ícones (Leaflet DivIcon) — círculos coloridos sem PNG externo
  const markerIcon1 = useMemo(() => {
    const size = Math.max(24, Math.round(iconSize1));
    return L.divIcon({
      className: "sm-marker sm-marker--blue",
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;
              background:#2563eb;box-shadow:0 0 0 3px white inset,0 1px 6px rgba(0,0,0,.35);
              border:2px solid #1e40af"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 8],
    });
  }, [iconSize1]);

  const markerIcon2 = useMemo(() => {
    const size = Math.max(24, Math.round(iconSize2));
    return L.divIcon({
      className: "sm-marker sm-marker--red",
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;
              background:#dc2626;box-shadow:0 0 0 3px white inset,0 1px 6px rgba(0,0,0,.35);
              border:2px solid #991b1b"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 8],
    });
  }, [iconSize2]);

  // Clique no mapa: encaminha a UTM para o alvo ativo
  const handlePick = (utm: UtmCoord) => (activeTarget === "p1" ? setUtm1(utm) : setUtm2(utm));

  return (
    <div className="space-y-6">
      {/* Ações principais */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ActionClickCard activeTarget={activeTarget} setActiveTarget={setActiveTarget} />
        <BaseMapCard baseMap={baseMap} setBaseMap={setBaseMap} />
        <DistanceCard distMeters={distMeters} />
      </div>

      {/* Altitudes + Sistema + Saídas */}
      <div className="grid lg:grid-cols-3 gap-4">
        <AltSysCard
          altCB={altCB} setAltCB={setAltCB}
          altPV={altPV} setAltPV={setAltPV}
          milsBase={milsBase} setMilsBase={setMilsBase}
          deltaH={deltaH}
        />
        <div className="lg:col-span-2">
          <OutputsPanel
            siteDeg={siteDeg}
            milsBase={milsBase}
            toMils={toMils}
            driftMil={driftMil}
            bearingDeg={bearingDeg}
            distMeters={distMeters}
          />
        </div>
      </div>

      {/* Cards de pontos */}
      <div className="grid lg:grid-cols-2 gap-4">
        <PointCard
          title="Ponto 1"
          activeBadge={activeTarget === "p1"}
          activeLabel="clique → P1"
          name={name1}
          onNameChange={setName1}
          iconSize={iconSize1}
          onIconSizeChange={setIconSize1}
        />
        <PointCard
          title="Ponto 2"
          activeBadge={activeTarget === "p2"}
          activeLabel="clique → P2"
          name={name2}
          onNameChange={setName2}
          iconSize={iconSize2}
          onIconSizeChange={setIconSize2}
        />
      </div>

      {/* Formulários UTM */}
      <div className="grid lg:grid-cols-2 gap-4">
        <UtmForm title="Ponto 1 (UTM)" utm={utm1} setUtm={setUtm1} />
        <UtmForm title="Ponto 2 (UTM)" utm={utm2} setUtm={setUtm2} />
      </div>

      {/* Mapa + overlays */}
      <div className="card overflow-hidden h-screen relative">
        <MapHud
          siteDeg={siteDeg}
          milsBase={milsBase}
          toMils={toMils}
          driftMil={driftMil}
          bearingDeg={bearingDeg}
          distMeters={distMeters}
        />
        <MapPointControls activeTarget={activeTarget} setActiveTarget={setActiveTarget} />

        <MapContainer
          center={[p1?.lat ?? p2?.lat ?? defaultCenter.lat, p1?.lng ?? p2?.lng ?? defaultCenter.lng]}
          zoom={5}
          style={{ width: "100%", height: "100vh", cursor: "pointer" }}
          doubleClickZoom={false}
          zoomControl={true}
          attributionControl={true}
        >
          {/* Forçar remontagem do LayersControl ao trocar baseMap para evitar estado interno antigo */}
          <LayersControl position="topright" key={baseMap}>
            <LayersControl.BaseLayer checked={baseMap === "roadmap"} name="OpenStreetMap (Roadmap)">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={baseMap === "terrain"} name="OpenTopoMap (Terrain)">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={baseMap === "satellite"} name="Esri WorldImagery (Satellite)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Sincroniza eventos de troca de layer base com estado React */}
          <LayerSync onBaseMapChange={setBaseMap} />

          {/* Clique para definir P1/P2 (conversão LatLng->UTM acontece dentro do componente) */}
          <ClickCapture active={activeTarget} onPick={handlePick} />

          {/* Ajuste de enquadramento quando P1/P2 existem */}
          <FitBounds p1={p1 ?? undefined} p2={p2 ?? undefined} padding={80} />

          {/* Marcadores e linha entre os pontos */}
          <MarkersLayer
            p1={p1 ?? null}
            p2={p2 ?? null}
            name1={name1}
            name2={name2}
            icon1={markerIcon1}
            icon2={markerIcon2}
          />
          <RouteLine p1={p1 ?? null} p2={p2 ?? null} />
        </MapContainer>
      </div>
    </div>
  );
}
