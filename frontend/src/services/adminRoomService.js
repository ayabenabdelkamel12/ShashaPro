import api from "./api";

export const getAdminRooms = async () => {
    const response = await api.get("/admin/rooms");

    return response.data;
};

export const getAdminRoom = async (roomId) => {
    const response = await api.get(`/admin/rooms/${roomId}`);

    return response.data;
};

export const createRoom = async (roomData) => {
    const response = await api.post(
        "/admin/rooms",
        roomData
    );

    return response.data;
};

export const updateRoom = async (roomId, roomData) => {
    const response = await api.put(
        `/admin/rooms/${roomId}`,
        roomData
    );

    return response.data;
};

export const deleteRoom = async (roomId) => {
    const response = await api.delete(
        `/admin/rooms/${roomId}`
    );

    return response.data;
};