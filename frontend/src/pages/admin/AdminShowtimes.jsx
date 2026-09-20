import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAdminShowtimes,
    deleteShowtime,
} from "../../services/adminShowtimeService";

function AdminShowtimes() {
    const [showtimes, setShowtimes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] =
        useState(null);

    const loadShowtimes = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminShowtimes();

            setShowtimes(data.showtimes || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de charger les séances."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShowtimes();
    }, []);

    const handleDelete = async (showtimeId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette séance ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(showtimeId);
            setError("");

            await deleteShowtime(showtimeId);

            await loadShowtimes();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de supprimer la séance."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDateTime = (date) => {
        if (!date) {
            return "Non disponible";
        }

        return new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <main className="admin-showtimes-page">
                <div className="container admin-showtimes__state">
                    <div className="loading">
                        Chargement des séances...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-showtimes-page">
            <section className="admin-showtimes__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Gestion des
                        <span> séances.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Planifiez et gérez les projections,
                        les salles et les tarifs de votre cinéma.
                    </p>
                </div>
            </section>

            <section className="section admin-showtimes__main">
                <div className="container">
                    <div className="admin-showtimes__toolbar">
                        <div>
                            <span className="home__eyebrow">
                                Programmation
                            </span>

                            <h2>
                                {showtimes.length}{" "}
                                {showtimes.length > 1
                                    ? "séances"
                                    : "séance"}
                            </h2>
                        </div>

                        <Link
                            to="/admin/showtimes/create"
                            className="home__btn home__btn--primary"
                        >
                            + Ajouter une séance
                        </Link>
                    </div>

                    {error && (
                        <div className="alert alert-danger admin-showtimes__error">
                            {error}
                        </div>
                    )}

                    {!error && showtimes.length === 0 && (
                        <div className="empty-state admin-showtimes__empty">
                            <div className="admin-showtimes__empty-icon">
                                ✦
                            </div>

                            <h3>Aucune séance trouvée</h3>

                            <p>
                                Votre programmation ne contient
                                actuellement aucune séance.
                            </p>

                            <Link
                                to="/admin/showtimes/create"
                                className="home__btn home__btn--primary"
                            >
                                Ajouter la première séance
                            </Link>
                        </div>
                    )}

                    {showtimes.length > 0 && (
                        <div className="admin-showtimes__grid">
                            {showtimes.map((showtime) => (
                                <article
                                    key={showtime.id}
                                    className="admin-showtime-card"
                                >
                                    <div className="admin-showtime-card__top">
                                        <span className="admin-showtime-card__label">
                                            SÉANCE
                                        </span>

                                        <span
                                            className={
                                                showtime.is_active
                                                    ? "admin-showtime-card__status admin-showtime-card__status--active"
                                                    : "admin-showtime-card__status admin-showtime-card__status--inactive"
                                            }
                                        >
                                            {showtime.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="admin-showtime-card__movie">
                                        <span className="home__eyebrow">
                                            Film
                                        </span>

                                        <h2>
                                            {showtime.movie?.title ||
                                                "Film"}
                                        </h2>
                                    </div>

                                    <div className="admin-showtime-card__details">
                                        <div className="admin-showtime-card__detail">
                                            <span>Salle</span>

                                            <strong>
                                                {showtime.room?.name ||
                                                    "Salle"}
                                            </strong>
                                        </div>

                                        <div className="admin-showtime-card__detail">
                                            <span>Prix</span>

                                            <strong>
                                                {showtime.price} DH
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-showtime-card__times">
                                        <div>
                                            <span>Début</span>

                                            <strong>
                                                {formatDateTime(
                                                    showtime.start_time
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Fin</span>

                                            <strong>
                                                {formatDateTime(
                                                    showtime.end_time
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-showtime-card__actions">
                                        <Link
                                            to={`/admin/showtimes/${showtime.id}/edit`}
                                            className="admin-showtime-card__edit"
                                        >
                                            Modifier
                                            <span>→</span>
                                        </Link>

                                        <button
                                            type="button"
                                            className="admin-showtime-card__delete"
                                            onClick={() =>
                                                handleDelete(
                                                    showtime.id
                                                )
                                            }
                                            disabled={
                                                deleteLoading ===
                                                showtime.id
                                            }
                                        >
                                            {deleteLoading ===
                                            showtime.id
                                                ? "Suppression..."
                                                : "Supprimer"}
                                        </button>
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

export default AdminShowtimes;
