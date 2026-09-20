import { useState } from "react";

function ShowtimeForm({
    initialData = {},
    movies = [],
    rooms = [],
    onSubmit,
    loading = false,
    submitLabel = "Ajouter la séance",
}) {
    const [form, setForm] = useState({
        movie_id: initialData.movie_id || "",
        room_id: initialData.room_id || "",
        start_time: initialData.start_time
            ? initialData.start_time.slice(0, 16)
            : "",
        end_time: initialData.end_time
            ? initialData.end_time.slice(0, 16)
            : "",
        price: initialData.price || "",
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        try {
            await onSubmit({
                movie_id: Number(form.movie_id),
                room_id: Number(form.room_id),
                start_time: form.start_time,
                end_time: form.end_time,
                price: Number(form.price),
            });
        } catch (error) {
            console.error(error);

            const errors = error.response?.data?.errors;

            if (errors) {
                const firstError =
                    Object.values(errors)[0]?.[0];

                setError(
                    firstError ||
                        "Erreur de validation."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                        "Impossible d'enregistrer la séance."
                );
            }
        }
    };

    return (
        <form
            className="showtime-form"
            onSubmit={handleSubmit}
        >
            {error && (
                <div className="alert alert-danger showtime-form__error">
                    {error}
                </div>
            )}

            <div className="showtime-form__section">
                <div className="showtime-form__section-heading">
                    <span className="home__eyebrow">
                        Programmation
                    </span>

                    <h2>Informations de la séance</h2>

                    <p>
                        Sélectionnez le film et la salle,
                        puis définissez l'horaire et le prix
                        de la projection.
                    </p>
                </div>

                <div className="showtime-form__grid">
                    <div className="showtime-form__field">
                        <label htmlFor="movie_id">
                            Film
                        </label>

                        <select
                            id="movie_id"
                            name="movie_id"
                            value={form.movie_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Sélectionner un film
                            </option>

                            {movies.map((movie) => (
                                <option
                                    key={movie.id}
                                    value={movie.id}
                                >
                                    {movie.title}
                                </option>
                            ))}
                        </select>

                        {movies.length === 0 && (
                            <span className="showtime-form__hint">
                                Aucun film disponible.
                            </span>
                        )}
                    </div>

                    <div className="showtime-form__field">
                        <label htmlFor="room_id">
                            Salle
                        </label>

                        <select
                            id="room_id"
                            name="room_id"
                            value={form.room_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Sélectionner une salle
                            </option>

                            {rooms.map((room) => (
                                <option
                                    key={room.id}
                                    value={room.id}
                                >
                                    {room.name} —{" "}
                                    {room.capacity} places
                                </option>
                            ))}
                        </select>

                        {rooms.length === 0 && (
                            <span className="showtime-form__hint">
                                Aucune salle disponible.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="showtime-form__section">
                <div className="showtime-form__section-heading">
                    <span className="home__eyebrow">
                        Horaire
                    </span>

                    <h2>Date et horaires</h2>

                    <p>
                        Définissez précisément le début et la
                        fin de la projection.
                    </p>
                </div>

                <div className="showtime-form__grid">
                    <div className="showtime-form__field">
                        <label htmlFor="start_time">
                            Date et heure de début
                        </label>

                        <input
                            id="start_time"
                            name="start_time"
                            type="datetime-local"
                            value={form.start_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="showtime-form__field">
                        <label htmlFor="end_time">
                            Date et heure de fin
                        </label>

                        <input
                            id="end_time"
                            name="end_time"
                            type="datetime-local"
                            value={form.end_time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="showtime-form__section">
                <div className="showtime-form__section-heading">
                    <span className="home__eyebrow">
                        Tarification
                    </span>

                    <h2>Prix de la séance</h2>

                    <p>
                        Indiquez le tarif appliqué pour cette
                        projection.
                    </p>
                </div>

                <div className="showtime-form__price">
                    <div className="showtime-form__field">
                        <label htmlFor="price">
                            Prix (DH)
                        </label>

                        <div className="showtime-form__price-input">
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Ex. 70"
                                required
                            />

                            <span>DH</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="showtime-form__footer">
                <button
                    type="submit"
                    className="home__btn home__btn--primary showtime-form__submit"
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

export default ShowtimeForm;
