import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieForm from "../../components/movies/MovieForm";
import { createMovie } from "../../services/adminMovieService";

function CreateMovie() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (movieData) => {
        try {
            setLoading(true);

            await createMovie(movieData);

            navigate("/admin/movies");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="create-movie-page">
            <section className="create-movie__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Ajouter un
                        <span> film.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Ajoutez un nouveau film au catalogue
                        de ShashaPro en renseignant ses informations.
                    </p>
                </div>
            </section>

            <section className="section create-movie__main">
                <div className="container">
                    <div className="create-movie__content">
                        <MovieForm
                            onSubmit={handleSubmit}
                            loading={loading}
                            submitLabel="Ajouter le film"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CreateMovie;
