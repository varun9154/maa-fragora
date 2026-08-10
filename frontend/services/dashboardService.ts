import api from "@/lib/api";

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data.data;
};