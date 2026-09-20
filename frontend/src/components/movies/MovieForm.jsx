import { useState } from "react";

function MovieForm({
    initialData = {},
    onSubmit,
    loading = false,
    submitLabel = "Ajouter le film",
}) {
    const [form, setForm] = useState({
        title: initialData.title || "",
        description: initialData.description || "",
        genre: initialData.genre || "",
        duration: initialData.duration || "",
        director: initialData.director || "",
        release_date: initialData.release_date
            ? initialData.release_date.substring(0, 10)
            : "",
        poster: null,
    });

    const [preview, setPreview] = useState(
        initialData.poster_url
            ? `http://127.0.0.1:8000/storage/${initialData.poster_url}`
            : ""
    );

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handlePosterChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setForm((currentForm) => ({
            ...currentForm,
            poster: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        try {
            await onSubmit({
                ...form,
                duration: form.duration
                    ? Number(form.duration)
                    : null,
            });
        } catch (error) {
    console.error("ERREUR COMPLETE :", error);
console.error(
    "REPONSE LARAVEL :",
    JSON.stringify(error.response?.data, null, 2)
);
    const errors = error.response?.data?.errors;

    if (errors) {
        const firstError = Object.values(errors)[0]?.[0];

        setError(
            firstError || "Erreur de validation."
        );
    } else {
        setError(
            error.response?.data?.message ||
                "Impossible d'enregistrer le film."
        );
    }
}
    };

    return (
        <form
            className="movie-form"
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="alert alert-danger movie-form__error">
                    {error}
                </div>
            )}

            <div className="movie-form__section">
                <div className="movie-form__section-heading">
                    <span className="home__eyebrow">
                        Informations
                    </span>

                    <h2>Présentation du film</h2>

                    <p>
                        Renseignez les informations principales
                        qui seront affichées dans le catalogue.
                    </p>
                </div>

                <div className="movie-form__grid">
                    <div className="movie-form__field movie-form__field--full">
                        <label htmlFor="title">
                            Titre
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ex. Barbie"
                            required
                        />
                    </div>

                    <div className="movie-form__field movie-form__field--full">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Présentez brièvement le film..."
                        />
                    </div>

                    <div className="movie-form__field">
                        <label htmlFor="genre">
                            Genre
                        </label>

                        <input
                            id="genre"
                            name="genre"
                            type="text"
                            value={form.genre}
                            onChange={handleChange}
                            placeholder="Ex. Comédie"
                        />
                    </div>

                    <div className="movie-form__field">
                        <label htmlFor="duration">
                            Durée (minutes)
                        </label>

                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            value={form.duration}
                            onChange={handleChange}
                            placeholder="Ex. 114"
                        />
                    </div>

                    <div className="movie-form__field">
                        <label htmlFor="director">
                            Réalisateur
                        </label>

                        <input
                            id="director"
                            name="director"
                            type="text"
                            value={form.director}
                            onChange={handleChange}
                            placeholder="Ex. Greta Gerwig"
                        />
                    </div>

                    <div className="movie-form__field">
                        <label htmlFor="release_date">
                            Date de sortie
                        </label>

                        <input
                            id="release_date"
                            name="release_date"
                            type="date"
                            value={form.release_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="movie-form__section">
                <div className="movie-form__section-heading">
                    <span className="home__eyebrow">
                        Médias
                    </span>

                    <h2>Affiche du film</h2>

                    <p>
                        Sélectionnez une image depuis votre ordinateur.
                    </p>
                </div>

                <div className="movie-form__grid">
                    <div className="movie-form__field movie-form__field--full">
                        <label htmlFor="poster">
                            Affiche
                        </label>

                        <input
                            id="poster"
                            name="poster"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePosterChange}
                        />

                        <span className="movie-form__hint">
                            Formats acceptés : JPG, PNG, WEBP — maximum 5 Mo.
                        </span>

                        {preview && (
                            <div className="movie-form__poster-preview">
                                <img
                                    src={preview}
                                    alt="Aperçu de l'affiche"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="movie-form__footer">
                <button
                    type="submit"
                    className="home__btn home__btn--primary movie-form__submit"
                    disabled={loading}
                >
                    {loading
                        ? "Enregistrement..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default MovieForm;