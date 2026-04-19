import { useEffect, useState } from "react";
import { fallbackMapData } from "../pages/Homepage/components/Maps.data";
import { getHomepageMapOverview } from "../services/mapsService";
import { mapHomepageMapData } from "../utils/mapsMapper";

export function useHomepageMap() {
  const [mapData, setMapData] = useState(fallbackMapData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await getHomepageMapOverview();
        const payload = response?.data?.data ?? response?.data;
        const mapped = mapHomepageMapData(payload);
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
