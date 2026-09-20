import api from "./api";

export const getMovies = async (params = {}) => {
  const response = await api.get("/movies", {
    params,
  });

  return response.data;
};

export const getMovie = async (movieId) => {
  const response = await api.get(`/movies/${movieId}`);

  return response.data;
};