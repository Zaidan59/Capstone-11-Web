import { useEffect, useState } from "react";
import {
  fallbackMapData,
  fetchHomepageMapData,
} from "../pages/Homepage/components/Map/mapsData";

export function useHomepageMap() {
  const [mapData, setMapData] = useState(fallbackMapData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const mapped = await fetchHomepageMapData();
        const hasApiData = mapped.kitchens.length > 0 || mapped.schools.length > 0;

        if (hasApiData) {
          setMapData(mapped);
          setIsUsingFallback(false);
          return;
        }

        setMapData(fallbackMapData);
        setIsUsingFallback(true);
      } catch (error) {
        console.error("Gagal mengambil data peta homepage:", error);
        setMapData(fallbackMapData);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapData();
  }, []);

  return {
    mapData,
    isLoading,
    isUsingFallback,
  };
}
