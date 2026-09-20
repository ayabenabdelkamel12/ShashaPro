import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getAdminRoomSeats,
    createSeat,
    generateSeats,
    clearSeats,
    deleteSeat,
} from "../../services/adminSeatService";
import { getAdminRoom } from "../../services/adminRoomService";

function AdminSeats() {
    const { id } = useParams();

    const [room, setRoom] = useState(null);
    const [seats, setSeats] = useState([]);

    const [form, setForm] = useState({
        row_label: "",
        seat_number: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [roomData, seatsData] = await Promise.all([
                getAdminRoom(id),
                getAdminRoomSeats(id),
            ]);

            setRoom(roomData.room);
            setSeats(seatsData.seats || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de charger les sièges."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitLoading(true);
            setError("");

            await createSeat(id, {
                row_label: form.row_label.toUpperCase(),
                seat_number: Number(form.seat_number),
            });

            setForm({
                row_label: "",
                seat_number: "",
            });

            await loadData();
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
                        "Impossible d'ajouter le siège."
                );
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleGenerateSeats = async () => {
        const confirmed = window.confirm(
            `Voulez-vous générer automatiquement ${room.capacity} sièges pour cette salle ?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setSubmitLoading(true);
            setError("");

            await generateSeats(id);

            await loadData();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de générer les sièges."
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleClearSeats = async () => {
        const confirmed = window.confirm(
            `Voulez-vous vraiment supprimer les ${seats.length} sièges de cette salle ? Cette action est irréversible.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setClearLoading(true);
            setError("");

            await clearSeats(id);

            await loadData();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de supprimer les sièges."
            );
        } finally {
            setClearLoading(false);
        }
    };

    const handleDelete = async (seatId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce siège ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(seatId);
            setError("");

            await deleteSeat(id, seatId);

            await loadData();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de supprimer le siège."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <main className="admin-seats-page">
                <div className="container admin-seats__state">
                    <div className="loading">
                        Chargement des sièges...
                    </div>
                </div>
            </main>
        );
    }

    if (error && !room) {
        return (
            <main className="admin-seats-page">
                <div className="container admin-seats__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!room) {
        return (
            <main className="admin-seats-page">
                <div className="container admin-seats__state">
                    <div className="empty-state">
                        <h3>Salle introuvable</h3>
                        <p>
                            La salle demandée n'existe pas ou
                            n'est plus disponible.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-seats-page">
            <section className="admin-seats__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Gestion des
                        <span> sièges.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Configurez les places disponibles dans
                        <strong> « {room.name} »</strong>.
                    </p>
                </div>
            </section>

            <section className="section admin-seats__main">
                <div className="container">
                    {error && (
                        <div className="alert alert-danger admin-seats__error">
                            {error}
                        </div>
                    )}

                    <div className="admin-seats__room-summary">
                        <div className="admin-seats__room-icon">
                            S
                        </div>

                        <div className="admin-seats__room-info">
                            <span className="home__eyebrow">
                                Salle
                            </span>

                            <h2>{room.name}</h2>
                        </div>

                        <div className="admin-seats__room-stats">
                            <div>
                                <span>Capacité</span>
                                <strong>{room.capacity}</strong>
                            </div>

                            <div>
                                <span>Sièges créés</span>
                                <strong>{seats.length}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="admin-seats__actions">
                        <button
                            type="button"
                            className="home__btn home__btn--primary"
                            onClick={handleGenerateSeats}
                            disabled={
                                submitLoading ||
                                clearLoading ||
                                seats.length > 0
                            }
                        >
                            {submitLoading
                                ? "Génération..."
                                : `Générer ${room.capacity} sièges automatiquement`}
                        </button>

                        {seats.length > 0 && (
                            <button
                                type="button"
                                className="home__btn"
                                onClick={handleClearSeats}
                                disabled={
                                    submitLoading ||
                                    clearLoading
                                }
                            >
                                {clearLoading
                                    ? "Suppression..."
                                    : "Réinitialiser les sièges"}
                            </button>
                        )}
                    </div>

                    <div className="admin-seats__layout">
                        <section className="admin-seats__add">
                            <div className="admin-seats__section-heading">
                                <span className="home__eyebrow">
                                    Configuration
                                </span>

                                <h2>Ajouter un siège</h2>

                                <p>
                                    Ajoutez une place en
                                    renseignant sa rangée et
                                    son numéro.
                                </p>
                            </div>

                            <form
                                className="seat-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="seat-form__field">
                                    <label htmlFor="row_label">
                                        Rangée
                                    </label>

                                    <input
                                        id="row_label"
                                        name="row_label"
                                        type="text"
                                        value={form.row_label}
                                        onChange={handleChange}
                                        placeholder="A"
                                        maxLength="10"
                                        required
                                    />
                                </div>

                                <div className="seat-form__field">
                                    <label htmlFor="seat_number">
                                        Numéro
                                    </label>

                                    <input
                                        id="seat_number"
                                        name="seat_number"
                                        type="number"
                                        min="1"
                                        value={form.seat_number}
                                        onChange={handleChange}
                                        placeholder="1"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="home__btn home__btn--primary seat-form__submit"
                                    disabled={
                                        submitLoading ||
                                        clearLoading
                                    }
                                >
                                    {submitLoading
                                        ? "Ajout..."
                                        : "Ajouter le siège"}
                                </button>
                            </form>
                        </section>

                        <section className="admin-seats__list-section">
                            <div className="admin-seats__section-heading admin-seats__section-heading--list">
                                <div>
                                    <span className="home__eyebrow">
                                        Configuration actuelle
                                    </span>

                                    <h2>Sièges</h2>
                                </div>

                                <span className="admin-seats__count">
                                    {seats.length}
                                </span>
                            </div>

                            {seats.length === 0 ? (
                                <div className="empty-state admin-seats__empty">
                                    <div className="admin-seats__empty-icon">
                                        S
                                    </div>

                                    <h3>Aucun siège créé</h3>

                                    <p>
                                        Commencez par ajouter les
                                        sièges de cette salle.
                                    </p>
                                </div>
                            ) : (
                                <div className="admin-seats__grid">
                                    {seats.map((seat) => (
                                        <article
                                            key={seat.id}
                                            className="admin-seat-card"
                                        >
                                            <div className="admin-seat-card__number">
                                                <span>
                                                    {seat.row_label}
                                                </span>

                                                <strong>
                                                    {seat.seat_number}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                className="admin-seat-card__delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        seat.id
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading ===
                                                    seat.id
                                                }
                                            >
                                                {deleteLoading ===
                                                seat.id
                                                    ? "Suppression..."
                                                    : "Supprimer"}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="admin-seats__footer">
                        <Link
                            to="/admin/rooms"
                            className="admin-seats__back"
                        >
                            <span>←</span>
                            Retour aux salles
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminSeats;
