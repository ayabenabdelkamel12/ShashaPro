import { useEffect, useState } from "react";
import MovieCard from "../../components/movies/MovieCard";
import { getMovies } from "../../services/movieService";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);

    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMovies = async (selectedGenre = genre) => {
        try {
            setLoading(true);
            setError("");

            const data = await getMovies({
                search: search || undefined,
                genre: selectedGenre || undefined,
            });

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
        const loadInitialMovies = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMovies();

                const loadedMovies = data.movies || [];

                setMovies(loadedMovies);

                const uniqueGenres = [
                    ...new Set(
                        loadedMovies
                            .map((movie) => movie.genre)
                            .filter(
                                (genre) =>
                                    genre && genre.trim() !== ""
                            )
                    ),
                ].sort();

                setGenres(uniqueGenres);
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

        loadInitialMovies();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        await loadMovies();
    };

    const handleGenreChange = async (event) => {
        const selectedGenre = event.target.value;

        setGenre(selectedGenre);

        await loadMovies(selectedGenre);
    };

    return (
        <main className="movies-page">
            {/* HEADER */}
            <section className="movies-page__header">
    <div className="container">
        <span className="home__eyebrow">
            ✦ Programmation cinéma
        </span>

        <h1>
            Les films
            <span> à l'affiche.</span>
        </h1>

        <div className="gold-line" />

        <p>
            Découvrez les films disponibles et choisissez
            votre prochaine séance.
        </p>
    </div>
</section>

            {/* SEARCH */}
            <section className="movies-page__filters">
                <div className="container">
                    <form
                        className="movies-filter"
                        onSubmit={handleSearch}
                    >
                        <div className="movies-filter__search">
                            <label htmlFor="movie-search">
                                Rechercher
                            </label>

                            <input
                                id="movie-search"
                                type="search"
                                placeholder="Rechercher un film..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <div className="movies-filter__genre">
                            <label htmlFor="movie-genre">
                                Genre
                            </label>

                            <select
                                id="movie-genre"
                                value={genre}
                                onChange={handleGenreChange}
                            >
                                <option value="">
                                    Tous les genres
                                </option>

                                {genres.map((genreName) => (
                                    <option
                                        key={genreName}
                                        value={genreName}
                                    >
                                        {genreName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="home__btn home__btn--primary movies-filter__button"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>
            </section>

            {/* MOVIES */}
            <section className="section movies-page__list">
                <div className="container">
                    {loading && (
                        <div className="loading">
                            Chargement des films...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        movies.length === 0 && (
                            <div className="empty-state">
                                <h3>Aucun film trouvé</h3>
                                <p>
                                    Essayez une autre recherche ou
                                    un autre genre.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        movies.length > 0 && (
                            <>
                                <div className="movies-page__result">
                                    <span>
                                        Notre sélection
                                    </span>

                                    <strong>
                                        {movies.length}{" "}
                                        {movies.length > 1
                                            ? "films"
                                            : "film"}
                                    </strong>
                                </div>

                                <div className="movies-grid">
                                    {movies.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                </div>
            </section>
        </main>
    );
}

export default Movies;