import api from "./api";

export const getAdminMovies = async (params = {}) => {
    const response = await api.get("/admin/movies", {
        params,
    });

    return response.data;
};

export const getAdminMovie = async (movieId) => {
    const response = await api.get(`/admin/movies/${movieId}`);

    return response.data;
};

export const createMovie = async (movieData) => {
    const formData = new FormData();

    Object.keys(movieData).forEach((key) => {
        if (
            movieData[key] !== null &&
            movieData[key] !== undefined &&
            movieData[key] !== ""
        ) {
            formData.append(key, movieData[key]);
        }
    });

    const response = await api.post("/admin/movies", formData);

    return response.data;
};

export const updateMovie = async (movieId, movieData) => {
    const formData = new FormData();

    Object.keys(movieData).forEach((key) => {
        if (
            movieData[key] !== null &&
            movieData[key] !== undefined &&
            movieData[key] !== ""
        ) {
            formData.append(key, movieData[key]);
        }
    });

    formData.append("_method", "PUT");

    const response = await api.post(
        `/admin/movies/${movieId}`,
        formData
    );

    return response.data;
};

export const deleteMovie = async (movieId) => {
    const response = await api.delete(
        `/admin/movies/${movieId}`
    );

    return response.data;
};