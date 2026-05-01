import MapView from "../../components/maps/MapView";
import { useMapsData } from "../../hooks/useMapsData";

export default function Maps() {
  const { kitchens, schools, links, loading, error } = useMapsData();

  return (
    <MapView
      kitchens={kitchens}
      schools={schools}
      links={links}
      loading={loading}
      error={error}
    />
  );
}
