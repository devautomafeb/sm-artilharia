// src/App.tsx
import Layout from "./components/Layout";               // ou "./components/Layout" se não usar alias
import MapUtmDistanceLeaflet from "./components/MapUtmDistanceLeaflet";

export default function App() {
  return (
    <Layout>
      <MapUtmDistanceLeaflet />
    </Layout>
  );
}
