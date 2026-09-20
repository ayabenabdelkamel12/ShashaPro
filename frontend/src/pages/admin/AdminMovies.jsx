import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAdminMovies,
    deleteMovie,
} from "../../services/adminMovieService";

function AdminMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const loadMovies = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminMovies();

            setMovies(data.movies || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de charger les films."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    const handleDelete = async (movieId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce film ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(movieId);
            setError("");

            await deleteMovie(movieId);

            await loadMovies();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de supprimer le film."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <main className="admin-movies-page">
                <div className="container">
                    <div className="loading">
                        Chargement des films...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-movies-page">
            <section className="admin-movies__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Gestion des
                        <span> films.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Gérez la programmation des films disponibles
                        dans votre cinéma.
                    </p>
                </div>
            </section>

            <section className="section admin-movies__main">
                <div className="container">
                    <div className="admin-movies__toolbar">
                        <div>
                            <span className="home__eyebrow">
                                Catalogue
                            </span>

                            <h2>
                                {movies.length}{" "}
                                {movies.length > 1
                                    ? "films"
                                    : "film"}
                            </h2>
                        </div>

                        <Link
                            to="/admin/movies/create"
                            className="home__btn home__btn--primary"
                        >
                            + Ajouter un film
                        </Link>
                    </div>

                    {error && (
                        <div className="alert alert-danger admin-movies__error">
                            {error}
                        </div>
                    )}

                    {!error && movies.length === 0 && (
                        <div className="empty-state admin-movies__empty">
                            <div className="admin-movies__empty-icon">
                                ✦
                            </div>

                            <h3>Aucun film trouvé</h3>

                            <p>
                                Votre catalogue ne contient
                                actuellement aucun film.
                            </p>

                            <Link
                                to="/admin/movies/create"
                                className="home__btn home__btn--primary"
                            >
                                Ajouter le premier film
                            </Link>
                        </div>
                    )}

                    {movies.length > 0 && (
                        <div className="admin-movies__grid">
                            {movies.map((movie) => (
                                <article
                                    key={movie.id}
                                    className="admin-movie-card"
                                >
                                    <div className="admin-movie-card__poster">
                                        {movie.poster_url ? (
                                            <img
src={`http://127.0.0.1:8000/storage/${movie.poster_url}`}                                                alt={movie.title}
                                            />
                                        ) : (
                                            <div className="admin-movie-card__poster-empty">
                                                <span>
                                                    Pas d'affiche
                                                </span>
                                            </div>
                                        )}

                                        {movie.genre && (
                                            <span className="admin-movie-card__genre">
                                                {movie.genre}
                                            </span>
                                        )}
                                    </div>

                                    <div className="admin-movie-card__content">
                                        <h2>
                                            {movie.title}
                                        </h2>

                                        <div className="admin-movie-card__meta">
                                            {movie.duration && (
                                                <span>
                                                    Durée :{" "}
                                                    {
                                                        movie.duration
                                                    }{" "}
                                                    min
                                                </span>
                                            )}

                                            {movie.director && (
                                                <span>
                                                    Réalisé par{" "}
                                                    {
                                                        movie.director
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <div className="admin-movie-card__actions">
                                            <Link
                                                to={`/admin/movies/${movie.id}/edit`}
                                                className="admin-movie-card__edit"
                                            >
                                                Modifier
                                                <span>
                                                    →
                                                </span>
                                            </Link>

                                            <button
                                                type="button"
                                                className="admin-movie-card__delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        movie.id
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading ===
                                                    movie.id
                                                }
                                            >
                                                {deleteLoading ===
                                                movie.id
                                                    ? "Suppression..."
                                                    : "Supprimer"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AdminMovies;
