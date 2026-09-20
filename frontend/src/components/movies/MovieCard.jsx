import { Link } from "react-router-dom";

function MovieCard({ movie }) {
    return (
        <article className="movie-card">
            <div className="movie-card__poster-wrapper">
                {movie.poster_url ? (
                    <img
                        className="movie-card__poster"
                        src={`http://127.0.0.1:8000/storage/${movie.poster_url}`}
                        alt={movie.title}
                        loading="lazy"
                        onError={(e) => {
                            console.log("IMAGE ERROR:", e.currentTarget.src);
                        }}
                    />
                ) : (
                    <div className="movie-card__poster movie-card__poster--empty">
                        <span>Pas d'affiche</span>
                    </div>
                )}

                {movie.genre && (
                    <span className="movie-card__genre">
                        {movie.genre}
                    </span>
                )}
            </div>

            <div className="movie-card__content">
                <h2 className="movie-card__title">
                    {movie.title}
                </h2>

                <div className="movie-card__meta">
                    <span>◷ {movie.duration} min</span>

                    {movie.director && (
                        <span>
                            Réalisé par {movie.director}
                        </span>
                    )}
                </div>

                <Link
                    to={`/movies/${movie.id}`}
                    className="movie-card__link"
                >
                    Voir les détails
                    <span>→</span>
                </Link>
            </div>
        </article>
    );
}

export default MovieCard;