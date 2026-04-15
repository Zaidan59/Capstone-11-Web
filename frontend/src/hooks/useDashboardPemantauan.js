import { useEffect, useState } from "react";
import { getAllSPPG } from "../services/sppgService";
import { getAllSekolah } from "../services/sekolahService";
import {
  fallbackSchoolUnits,
  fallbackSppgUnits,
} from "../pages/Home/components/DashboardPemantauan.data";
import {
  mapSchoolItem,
  mapSppgItem,
} from "../utils/dashboardPemantauanMapper";

export function useDashboardPemantauan() {
  const [sppgUnits, setSppgUnits] = useState(fallbackSppgUnits);
  const [schoolUnits, setSchoolUnits] = useState(fallbackSchoolUnits);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

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
        const hasApiData = mappedSppg.length > 0 || mappedSchool.length > 0;

        if (hasApiData) {
          if (mappedSppg.length > 0) {
            setSppgUnits(mappedSppg);
          }
          if (mappedSchool.length > 0) {
            setSchoolUnits(mappedSchool);
          }
          setIsUsingFallback(false);
          return;
        }

        setSppgUnits(fallbackSppgUnits);
        setSchoolUnits(fallbackSchoolUnits);
        setIsUsingFallback(true);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setSppgUnits(fallbackSppgUnits);
        setSchoolUnits(fallbackSchoolUnits);
        setIsUsingFallback(true);
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
    isUsingFallback,
  };
}
