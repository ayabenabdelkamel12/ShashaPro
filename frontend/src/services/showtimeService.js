import api from "./api";

export const getShowtimes = async (params = {}) => {
  const response = await api.get("/showtimes", {
    params,
  });

  return response.data;
};

export const getShowtime = async (showtimeId) => {
  const response = await api.get(`/showtimes/${showtimeId}`);

  return response.data;
};

export const getAvailableSeats = async (showtimeId) => {
  const response = await api.get(
    `/showtimes/${showtimeId}/available-seats`
  );

  return response.data;
};