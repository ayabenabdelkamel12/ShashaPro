import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../../services/movieService";
import { getShowtimes } from "../../services/showtimeService";

function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovieData = async () => {
            try {
                setLoading(true);
                setError("");

                const [movieData, showtimesData] = await Promise.all([
                    getMovie(id),
                    getShowtimes({ movie_id: id }),
                ]);

                setMovie(movieData.movie);
                setShowtimes(showtimesData.showtimes || []);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger les informations du film."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMovieData();
    }, [id]);

    if (loading) {
        return (
            <main className="movie-details-page">
                <div className="container">
                    <div className="loading">
                        Chargement du film...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="movie-details-page">
                <div className="container movie-details-page__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!movie) {
        return (
            <main className="movie-details-page">
                <div className="container movie-details-page__state">
                    <div className="empty-state">
                        <h3>Film introuvable</h3>
                        <p>
                            Le film demandé n'existe pas ou n'est plus
                            disponible.
                        </p>

                        <Link
                            to="/movies"
                            className="home__btn home__btn--primary"
                        >
                            Retour aux films
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="movie-details-page">
            {/* =====================================================
                HERO / FILM PRESENTATION
            ====================================================== */}

            <section className="movie-details__hero">
                <div className="container movie-details__hero-inner">
                    <div className="movie-details__poster-wrapper">
                        {movie.poster_url ? (
                            <img
                                className="movie-details__poster"
src={`http://127.0.0.1:8000/storage/${movie.poster_url}`}                                alt={movie.title}
                            />
                        ) : (
                            <div className="movie-details__poster movie-details__poster--empty">
                                <span>Pas d'affiche</span>
                            </div>
                        )}
                    </div>

                    <div className="movie-details__content">
                        <span className="home__eyebrow">
                            ✦ Fiche du film
                        </span>

                        <h1>{movie.title}</h1>

                        <div className="gold-line" />

                        <div className="movie-details__meta">
                            {movie.genre && (
                                <span className="badge badge-burgundy">
                                    {movie.genre}
                                </span>
                            )}

                            {movie.duration && (
                                <span>
                                    <strong>Durée</strong>{" "}
                                    {movie.duration} min
                                </span>
                            )}

                            {movie.release_date && (
    <span>
        <strong>Sortie</strong>{" "}
        {new Date(movie.release_date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })}
    </span>
)}
                        </div>

                        {movie.director && (
                            <div className="movie-details__director">
                                <span>Réalisateur</span>
                                <strong>{movie.director}</strong>
                            </div>
                        )}

                        {movie.description && (
                            <div className="movie-details__description">
                                <h2>À propos du film</h2>
                                <p>{movie.description}</p>
                            </div>
                        )}

                        
                    </div>
                </div>
            </section>

            {/* =====================================================
                SHOWTIMES
            ====================================================== */}

            <section className="section movie-details__showtimes">
                <div className="container">
                    <div className="section-title movie-details__section-heading">
                        <span className="home__eyebrow">
                            ✦ Programmation
                        </span>

                        <h2>Choisissez votre séance.</h2>

                        <div className="gold-line" />

                        <p>
                            Sélectionnez une séance pour choisir vos sièges
                            et continuer votre réservation.
                        </p>
                    </div>

                    {showtimes.length === 0 ? (
                        <div className="empty-state">
                            <h3>Aucune séance disponible</h3>
                            <p>
                                Aucune séance n'est actuellement programmée
                                pour ce film.
                            </p>
                        </div>
                    ) : (
                        <div className="movie-details__showtimes-grid">
                            {showtimes.map((showtime) => (
                                <article
                                    key={showtime.id}
                                    className="movie-details__showtime-card"
                                >
                                    <div className="movie-details__showtime-top">
                                        <span className="movie-details__showtime-label">
                                            SALLE
                                        </span>

                                        <span className="badge badge-gold">
                                            {showtime.price} DH
                                        </span>
                                    </div>

                                    <h3>
                                        {showtime.room?.name || "Salle"}
                                    </h3>

                                    <div className="movie-details__showtime-info">
                                        <div>
                                            <span>Date</span>
                                            <strong>
    {new Date(showtime.start_time).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })}
</strong>
                                        </div>

                                        <div>
                                            <span>Tarif</span>
                                            <strong>
                                                {showtime.price} DH
                                            </strong>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/showtimes/${showtime.id}/seats`}
                                        className="movie-details__showtime-button"
                                    >
                                        Choisir cette séance
                                        <span>→</span>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default MovieDetails;
