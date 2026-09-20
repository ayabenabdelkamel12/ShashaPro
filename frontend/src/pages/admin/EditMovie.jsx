import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieForm from "../../components/movies/MovieForm";
import {
    getAdminMovie,
    updateMovie,
} from "../../services/adminMovieService";

function EditMovie() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovie = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminMovie(id);

                setMovie(data.movie);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger le film."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    const handleSubmit = async (movieData) => {
        try {
            setSubmitLoading(true);

            await updateMovie(id, movieData);

            navigate("/admin/movies");
        } catch (error) {
            throw error;
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="edit-movie-page">
                <div className="container edit-movie__state">
                    <div className="loading">
                        Chargement du film...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="edit-movie-page">
                <div className="container edit-movie__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!movie) {
        return (
            <main className="edit-movie-page">
                <div className="container edit-movie__state">
                    <div className="empty-state">
                        <h3>Film introuvable</h3>
                        <p>
                            Le film demandé n'existe pas ou
                            n'est plus disponible.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="edit-movie-page">
            <section className="edit-movie__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Modifier le
                        <span> film.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Modifiez les informations du film
                        <strong> « {movie.title} »</strong>.
                    </p>
                </div>
            </section>

            <section className="section edit-movie__main">
                <div className="container">
                    <div className="edit-movie__content">
                        <MovieForm
                            initialData={movie}
                            onSubmit={handleSubmit}
                            loading={submitLoading}
                            submitLabel="Enregistrer les modifications"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default EditMovie;
