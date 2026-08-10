import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboardService";

export function useDashboard() {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await getDashboard();
      setData(response);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
  };
}