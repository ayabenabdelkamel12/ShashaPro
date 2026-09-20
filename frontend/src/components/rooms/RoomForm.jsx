import { useState } from "react";

function RoomForm({
    initialData = {},
    onSubmit,
    loading = false,
    submitLabel = "Ajouter la salle",
}) {
    const [form, setForm] = useState({
        name: initialData.name || "",
        capacity: initialData.capacity || "",
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
                name: form.name,
                capacity: Number(form.capacity),
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
                        "Impossible d'enregistrer la salle."
                );
            }
        }
    };

    return (
        <form className="room-form" onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger room-form__error">
                    {error}
                </div>
            )}

            <div className="room-form__section">
                <div className="room-form__section-heading">
                    <span className="home__eyebrow">
                        Configuration
                    </span>

                    <h2>Informations de la salle</h2>

                    <p>
                        Renseignez le nom de la salle et le
                        nombre total de places disponibles.
                    </p>
                </div>

                <div className="room-form__grid">
                    <div className="room-form__field">
                        <label htmlFor="name">
                            Nom de la salle
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ex. Salle 1"
                            required
                        />
                    </div>

                    <div className="room-form__field">
                        <label htmlFor="capacity">
                            Capacité
                        </label>

                        <input
                            id="capacity"
                            name="capacity"
                            type="number"
                            min="1"
                            value={form.capacity}
                            onChange={handleChange}
                            placeholder="Ex. 120"
                            required
                        />

                        <span className="room-form__hint">
                            Nombre total de places dans la salle.
                        </span>
                    </div>
                </div>
            </div>

            <div className="room-form__footer">
                <button
                    type="submit"
                    className="home__btn home__btn--primary room-form__submit"
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

export default RoomForm;
