import { useEffect, useState } from "react";
import { fetchMapsData } from "../pages/Maps/mapsData";

export function useMapsData() {
  const [mapData, setMapData] = useState({
    kitchens: [],
    schools: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMapsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchMapsData();
        if (isMounted) {
          setMapData(data);
        }
      } catch (mapsError) {
        if (isMounted) {
          setError(mapsError);
          setMapData({
            kitchens: [],
            schools: [],
            links: [],
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMapsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    kitchens: mapData.kitchens,
    schools: mapData.schools,
    links: mapData.links,
    loading,
    error,
  };
}
