import { useMemo, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

import {
  utmToLatLng,
  haversineMeters,
  initialBearingDegrees,
  toMils,
  type UtmCoord,
  type LatLng,
} from "../functions/geo";

const defaultCenter: LatLng = { lat: -23.5505, lng: -46.6333 };

export default function MapUtmDistanceLeaflet() {
  // Pontos UTM
  const [utm1, setUtm1] = useState<UtmCoord>({ zone: 23, hemisphere: "S", easting: "", northing: "" });
  const [utm2, setUtm2] = useState<UtmCoord>({ zone: 23, hemisphere: "S", easting: "", northing: "" });

  // Metadados
  const [name1, setName1] = useState("Ponto 1");
  const [name2, setName2] = useState("Ponto 2");
  const [iconSize1, setIconSize1] = useState(40);
  const [iconSize2, setIconSize2] = useState(40);

  // Mapa
  const [baseMap, setBaseMap] = useState<BaseMap>("satellite");
  const [activeTarget, setActiveTarget] = useState<"p1" | "p2">("p1");

  // Altitudes e sistema
  const [altCB, setAltCB] = useState<number | "">("");
  const [altPV, setAltPV] = useState<number | "">("");
  const [milsBase, setMilsBase] = useState<6400 | 6000>(6400);

  // Conversões
  const p1 = useMemo(() => utmToLatLng(utm1), [utm1]);
  const p2 = useMemo(() => utmToLatLng(utm2), [utm2]);

  // Métricas
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
  const driftMil = useMemo(() => (distMeters ? 1.5 * (distMeters / 1000) : null), [distMeters]); // placeholder

  // Ícones (DivIcon, sem PNG)
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

  // Clique no mapa
  const handlePick = (utm: UtmCoord) => (activeTarget === "p1" ? setUtm1(utm) : setUtm2(utm));

  return (
    <div className="space-y-6">
      {/* Linha de ações principais */}
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

          <LayerSync baseMap={baseMap} onBaseMapChange={setBaseMap} />
          <ClickCapture active={activeTarget} onPick={handlePick} />
          <FitBounds p1={p1 ?? undefined} p2={p2 ?? undefined} padding={80} />

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
