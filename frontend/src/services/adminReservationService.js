import api from "./api";

export const getAdminReservations = async (params = {}) => {
    const response = await api.get("/admin/reservations", {
        params,
    });

    return response.data;
};

export const getAdminReservation = async (reservationId) => {
    const response = await api.get(
        `/admin/reservations/${reservationId}`
    );

    return response.data;
};

export const cancelAdminReservation = async (
    reservationId
) => {
    const response = await api.patch(
        `/admin/reservations/${reservationId}/cancel`
    );

    return response.data;
};

export const verifyReservation = async (bookingCode) => {
    const response = await api.get(
        `/admin/reservations/verify/${encodeURIComponent(bookingCode)}`
    );

    return response.data;
};