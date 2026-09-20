import api from "./api";

export const getStatistics = async () => {
    const response = await api.get("/admin/statistics");

    return response.data;
};