import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAdminReservations,
    cancelAdminReservation,
} from "../../services/adminReservationService";

function AdminReservations() {
    const [reservations, setReservations] = useState([]);

    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelLoading, setCancelLoading] =
        useState(null);

    const loadReservations = async (
        selectedStatus = status,
        selectedSearch = search
    ) => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminReservations({
                status:
                    selectedStatus || undefined,
                search:
                    selectedSearch || undefined,
            });

            setReservations(
                data.reservations || []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de charger les réservations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        await loadReservations();
    };

    const handleStatusChange = async (event) => {
        const selectedStatus = event.target.value;

        setStatus(selectedStatus);

        await loadReservations(
            selectedStatus,
            search
        );
    };

    const handleCancel = async (reservationId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment annuler cette réservation ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancelLoading(reservationId);
            setError("");

            await cancelAdminReservation(
                reservationId
            );

            await loadReservations();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible d'annuler la réservation."
            );
        } finally {
            setCancelLoading(null);
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

    const formatSeats = (seats) => {
        if (!seats || seats.length === 0) {
            return "Aucun";
        }

        return seats
            .map(
                (seat) =>
                    `${seat.row_label}${seat.seat_number}`
            )
            .join(", ");
    };

    if (loading) {
        return (
            <main className="admin-reservations-page">
                <div className="container admin-reservations__state">
                    <div className="loading">
                        Chargement des réservations...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-reservations-page">
            <section className="admin-reservations__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Gestion des
                        <span> réservations.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Consultez, recherchez et gérez les
                        réservations effectuées par vos clients.
                    </p>
                </div>
            </section>

            <section className="section admin-reservations__main">
                <div className="container">
                    <div className="admin-reservations__toolbar">
                        <div>
                            <span className="home__eyebrow">
                                Réservations
                            </span>

                            <h2>
                                {reservations.length}{" "}
                                {reservations.length > 1
                                    ? "réservations"
                                    : "réservation"}
                            </h2>
                        </div>
                    </div>

                    <form
                        className="admin-reservations__filters"
                        onSubmit={handleSearch}
                    >
                        <div className="admin-reservations__search">
                            <label htmlFor="search">
                                Recherche
                            </label>

                            <input
                                id="search"
                                type="search"
                                placeholder="Code, nom ou email..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="admin-reservations__status-filter">
                            <label htmlFor="status">
                                Statut
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <option value="">
                                    Tous les statuts
                                </option>

                                <option value="confirmed">
                                    Confirmées
                                </option>

                                <option value="cancelled">
                                    Annulées
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="home__btn home__btn--primary admin-reservations__search-btn"
                        >
                            Rechercher
                        </button>
                    </form>

                    {error && (
                        <div className="alert alert-danger admin-reservations__error">
                            {error}
                        </div>
                    )}

                    {!error &&
                        reservations.length === 0 && (
                            <div className="empty-state admin-reservations__empty">
                                <div className="admin-reservations__empty-icon">
                                    ✦
                                </div>

                                <h3>
                                    Aucune réservation trouvée
                                </h3>

                                <p>
                                    Aucune réservation ne
                                    correspond aux critères
                                    sélectionnés.
                                </p>
                            </div>
                        )}

                    {reservations.length > 0 && (
                        <div className="admin-reservations__grid">
                            {reservations.map(
                                (reservation) => (
                                    <article
                                        key={reservation.id}
                                        className="admin-reservation-card"
                                    >
                                        <div className="admin-reservation-card__top">
                                            <span className="admin-reservation-card__label">
                                                RÉSERVATION
                                            </span>

                                            <span
                                                className={
                                                    reservation.status ===
                                                    "confirmed"
                                                        ? "admin-reservation-card__status admin-reservation-card__status--confirmed"
                                                        : "admin-reservation-card__status admin-reservation-card__status--cancelled"
                                                }
                                            >
                                                {reservation.status ===
                                                "confirmed"
                                                    ? "Confirmée"
                                                    : "Annulée"}
                                            </span>
                                        </div>

                                        <div className="admin-reservation-card__movie">
                                            <span className="home__eyebrow">
                                                Film
                                            </span>

                                            <h2>
                                                {reservation
                                                    .showtime
                                                    ?.movie
                                                    ?.title ||
                                                    "Film"}
                                            </h2>
                                        </div>

                                        <div className="admin-reservation-card__client">
                                            <div>
                                                <span>
                                                    Client
                                                </span>

                                                <strong>
                                                    {reservation
                                                        .user
                                                        ?.name ||
                                                        "Client"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Email
                                                </span>

                                                <strong>
                                                    {reservation
                                                        .user
                                                        ?.email ||
                                                        "Non disponible"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="admin-reservation-card__code">
                                            <span>
                                                Code de réservation
                                            </span>

                                            <strong>
                                                {
                                                    reservation.booking_code
                                                }
                                            </strong>
                                        </div>

                                        <div className="admin-reservation-card__details">
                                            <div>
                                                <span>
                                                    Salle
                                                </span>

                                                <strong>
                                                    {reservation
                                                        .showtime
                                                        ?.room
                                                        ?.name ||
                                                        "Salle"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Sièges
                                                </span>

                                                <strong>
                                                    {formatSeats(
                                                        reservation.seats
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Total
                                                </span>

                                                <strong className="admin-reservation-card__price">
                                                    {
                                                        reservation.total_amount
                                                    }{" "}
                                                    DH
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="admin-reservation-card__showtime">
                                            <span>
                                                Séance
                                            </span>

                                            <strong>
                                                {formatDateTime(
                                                    reservation
                                                        .showtime
                                                        ?.start_time
                                                )}
                                            </strong>
                                        </div>

                                        <div className="admin-reservation-card__actions">
                                            <Link
                                                to={`/admin/reservations/${reservation.id}`}
                                                className="admin-reservation-card__details-link"
                                            >
                                                Voir les détails
                                                <span>→</span>
                                            </Link>

                                            {reservation.status ===
                                                "confirmed" && (
                                                <button
                                                    type="button"
                                                    className="admin-reservation-card__cancel"
                                                    onClick={() =>
                                                        handleCancel(
                                                            reservation.id
                                                        )
                                                    }
                                                    disabled={
                                                        cancelLoading ===
                                                        reservation.id
                                                    }
                                                >
                                                    {cancelLoading ===
                                                    reservation.id
                                                        ? "Annulation..."
                                                        : "Annuler"}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AdminReservations;
