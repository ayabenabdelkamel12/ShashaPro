import api from "./api";

export const getAdminRoomSeats = async (roomId) => {
    const response = await api.get(
        `/admin/rooms/${roomId}/seats`
    );

    return response.data;
};

export const createSeat = async (roomId, seatData) => {
    const response = await api.post(
        `/admin/rooms/${roomId}/seats`,
        seatData
    );

    return response.data;
};

export const updateSeat = async (
    roomId,
    seatId,
    seatData
) => {
    const response = await api.put(
        `/admin/rooms/${roomId}/seats/${seatId}`,
        seatData
    );

    return response.data;
};

export const deleteSeat = async (roomId, seatId) => {
    const response = await api.delete(
        `/admin/rooms/${roomId}/seats/${seatId}`
    );

    return response.data;
};

export const generateSeats = async (roomId) => {
    const response = await api.post(
        `/admin/rooms/${roomId}/seats/generate`
    );

    return response.data;
};
export const clearSeats = async (roomId) => {
    const response = await api.delete(
        `/admin/rooms/${roomId}/seats/clear`
    );

    return response.data;
};