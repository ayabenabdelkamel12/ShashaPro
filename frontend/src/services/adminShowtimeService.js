import api from "./api";

export const getAdminShowtimes = async (params = {}) => {
    const response = await api.get("/admin/showtimes", {
        params,
    });

    return response.data;
};

export const getAdminShowtime = async (showtimeId) => {
    const response = await api.get(
        `/admin/showtimes/${showtimeId}`
    );

    return response.data;
};

export const createShowtime = async (showtimeData) => {
    const response = await api.post(
        "/admin/showtimes",
        showtimeData
    );

    return response.data;
};

export const updateShowtime = async (
    showtimeId,
    showtimeData
) => {
    const response = await api.put(
        `/admin/showtimes/${showtimeId}`,
        showtimeData
    );

    return response.data;
};

export const deleteShowtime = async (showtimeId) => {
    const response = await api.delete(
        `/admin/showtimes/${showtimeId}`
    );

    return response.data;
};