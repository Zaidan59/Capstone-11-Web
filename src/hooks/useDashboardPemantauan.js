import { useEffect, useState } from "react";
import { getAllSPPG } from "../services/sppgService";
import { getAllSekolah } from "../services/sekolahService";
import { mapSchoolItem, mapSppgItem } from "../utils/dashboardPemantauanMapper";

export function useDashboardPemantauan() {
  const [sppgUnits, setSppgUnits] = useState([]);
  const [schoolUnits, setSchoolUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
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

        const mappedSppg = sppgData.map(mapSppgItem);
        const mappedSchool = schoolData.map(mapSchoolItem);

        setSppgUnits(mappedSppg);
        setSchoolUnits(mappedSchool);
        setError(null);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setSppgUnits([]);
        setSchoolUnits([]);
        setError("Gagal mengambil data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return {
    sppgUnits,
    schoolUnits,
    isLoading,
    error,
  };
}
