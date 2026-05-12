import { useEffect, useState } from "react";
import { getAllSekolah } from "../services/sekolahService";
import { getAllSPPG } from "../services/sppgService";
import { mapSchoolForMapPage, mapSppgForMapPage } from "../utils/mapsPageMapper";

export function useMapsPage() {
  const [sppgItems, setSppgItems] = useState([]);
  const [schoolItems, setSchoolItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setSppgItems(mappedSppg);
        setSchoolItems(mappedSchool);
        setError(null);
      } catch (error) {
        console.error("Gagal mengambil data peta:", error);
        setSppgItems([]);
        setSchoolItems([]);
        setError("Gagal mengambil data peta.");
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
    error,
  };
}
