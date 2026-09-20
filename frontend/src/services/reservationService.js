import api from "./api";

export const getMyReservations = async () => {
  const response = await api.get("/my-reservations");

  return response.data;
};

export const getReservation = async (reservationId) => {
  const response = await api.get(`/reservations/${reservationId}`);

  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post(
    "/reservations",
    reservationData
  );

  return response.data;
};

export const cancelReservation = async (reservationId) => {
  const response = await api.patch(
    `/reservations/${reservationId}/cancel`
  );

  return response.data;
};