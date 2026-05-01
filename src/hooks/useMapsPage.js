import { useEffect, useState } from "react";
import { fallbackSchoolData, fallbackSppgData } from "../pages/Maps/Maps.data";
import { getAllSekolah } from "../services/sekolahService";
import { getAllSPPG } from "../services/sppgService";
import { mapSchoolForMapPage, mapSppgForMapPage } from "../utils/mapsPageMapper";

export function useMapsPage() {
  const [sppgItems, setSppgItems] = useState(fallbackSppgData);
  const [schoolItems, setSchoolItems] = useState(fallbackSchoolData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [sppgResponse, schoolResponse] = await Promise.all([
          getAllSPPG(),
          getAllSekolah(),
        ]);

        const sppgData = Array.isArray(sppgResponse?.data?.data)
          ? sppgResponse.data.data
          : Array.isArray(sppgResponse?.data)
          ? sppgResponse.data
          : [];

        const schoolData = Array.isArray(schoolResponse?.data?.data)
          ? schoolResponse.data.data
          : Array.isArray(schoolResponse?.data)
          ? schoolResponse.data
          : [];

        const mappedSppg = sppgData.map(mapSppgForMapPage);
        const mappedSchool = schoolData.map(mapSchoolForMapPage);
        const hasApiData = mappedSppg.length > 0 || mappedSchool.length > 0;

        if (hasApiData) {
          if (mappedSppg.length > 0) {
            setSppgItems(mappedSppg);
          }
          if (mappedSchool.length > 0) {
            setSchoolItems(mappedSchool);
          }
          setIsUsingFallback(false);
          return;
        }

        setSppgItems(fallbackSppgData);
        setSchoolItems(fallbackSchoolData);
        setIsUsingFallback(true);
      } catch (error) {
        console.error("Gagal mengambil data peta:", error);
        setSppgItems(fallbackSppgData);
        setSchoolItems(fallbackSchoolData);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapData();
  }, []);

  return {
    sppgItems,
    schoolItems,
    isLoading,
    isUsingFallback,
  };
}
