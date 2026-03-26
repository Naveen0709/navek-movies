import api from "./api";

export const getRecommendations = async () => {
  const res = await api.get("/recommendations");
  return res.data;
};
