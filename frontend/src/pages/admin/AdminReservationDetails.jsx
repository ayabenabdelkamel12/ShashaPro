import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getAdminReservation,
} from "../../services/adminReservationService";

function AdminReservationDetails() {
    const { id } = useParams();

    const [reservation, setReservation] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReservation = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getAdminReservation(id);

                setReservation(
                    data.reservation
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger la réservation."
                );
            } finally {
                setLoading(false);
            }
        };

        loadReservation();
    }, [id]);

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
            <main className="admin-reservation-details-page">
                <div className="container admin-reservation-details__state">
                    <div className="loading">
                        Chargement de la réservation...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-reservation-details-page">
                <div className="container admin-reservation-details__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!reservation) {
        return (
            <main className="admin-reservation-details-page">
                <div className="container admin-reservation-details__state">
                    <div className="empty-state">
                        <div className="admin-reservation-details__empty-icon">
                            ✦
                        </div>

                        <h3>
                            Réservation introuvable
                        </h3>

                        <p>
                            La réservation demandée
                            n'existe pas ou n'est plus
                            disponible.
                        </p>

                        <Link
                            to="/admin/reservations"
                            className="home__btn home__btn--primary"
                        >
                            Retour aux réservations
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const isConfirmed =
        reservation.status === "confirmed";

    return (
        <main className="admin-reservation-details-page">
            <section className="admin-reservation-details__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Détails de la
                        <span> réservation.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Consultez toutes les informations
                        liées à cette réservation.
                    </p>
                </div>
            </section>

            <section className="section admin-reservation-details__main">
                <div className="container">
                    <div className="admin-reservation-details__topbar">
                        <Link
                            to="/admin/reservations"
                            className="admin-reservation-details__back"
                        >
                            ← Retour aux réservations
                        </Link>

                        <span
                            className={
                                isConfirmed
                                    ? "admin-reservation-details__status admin-reservation-details__status--confirmed"
                                    : "admin-reservation-details__status admin-reservation-details__status--cancelled"
                            }
                        >
                            {isConfirmed
                                ? "Confirmée"
                                : "Annulée"}
                        </span>
                    </div>

                    <div className="admin-reservation-details__layout">
                        <div className="admin-reservation-details__primary">
                            <section className="admin-reservation-details__card admin-reservation-details__booking">
                                <div className="admin-reservation-details__card-heading">
                                    <div>
                                        <span className="home__eyebrow">
                                            Réservation
                                        </span>

                                        <h2>
                                            {reservation
                                                .showtime
                                                ?.movie
                                                ?.title ||
                                                "Film"}
                                        </h2>
                                    </div>
                                </div>

                                <div className="admin-reservation-details__code">
                                    <span>
                                        Code de réservation
                                    </span>

                                    <strong>
                                        {
                                            reservation.booking_code
                                        }
                                    </strong>
                                </div>

                                <div className="admin-reservation-details__info-grid">
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
                                            Nombre de sièges
                                        </span>

                                        <strong>
                                            {reservation
                                                .seats
                                                ?.length ||
                                                0}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Prix par siège
                                        </span>

                                        <strong>
                                            {reservation
                                                .showtime
                                                ?.price ||
                                                "0"}{" "}
                                            DH
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Total
                                        </span>

                                        <strong className="admin-reservation-details__price">
                                            {
                                                reservation.total_amount
                                            }{" "}
                                            DH
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="admin-reservation-details__card">
                                <div className="admin-reservation-details__card-heading">
                                    <div>
                                        <span className="home__eyebrow">
                                            Projection
                                        </span>

                                        <h2>
                                            Informations de la séance
                                        </h2>
                                    </div>
                                </div>

                                <div className="admin-reservation-details__schedule">
                                    <div className="admin-reservation-details__schedule-item">
                                        <span>
                                            Début
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                reservation
                                                    .showtime
                                                    ?.start_time
                                            )}
                                        </strong>
                                    </div>

                                    <div className="admin-reservation-details__schedule-item">
                                        <span>
                                            Fin
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                reservation
                                                    .showtime
                                                    ?.end_time
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="admin-reservation-details__card">
                                <div className="admin-reservation-details__card-heading">
                                    <div>
                                        <span className="home__eyebrow">
                                            Placement
                                        </span>

                                        <h2>
                                            Sièges réservés
                                        </h2>
                                    </div>

                                    <span className="admin-reservation-details__seat-count">
                                        {reservation.seats
                                            ?.length || 0}{" "}
                                        siège
                                        {(reservation.seats
                                            ?.length || 0) >
                                        1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>

                                {reservation.seats?.length >
                                0 ? (
                                    <div className="admin-reservation-details__seats">
                                        {reservation.seats.map(
                                            (seat) => (
                                                <div
                                                    key={
                                                        seat.id
                                                    }
                                                    className="admin-reservation-details__seat"
                                                >
                                                    <span>
                                                        {seat.row_label}
                                                    </span>

                                                    <strong>
                                                        {
                                                            seat.seat_number
                                                        }
                                                    </strong>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="admin-reservation-details__no-seats">
                                        Aucun siège associé.
                                    </p>
                                )}
                            </section>
                        </div>

                        <aside className="admin-reservation-details__sidebar">
                            <section className="admin-reservation-details__card">
                                <div className="admin-reservation-details__card-heading">
                                    <div>
                                        <span className="home__eyebrow">
                                            Client
                                        </span>

                                        <h2>
                                            Coordonnées
                                        </h2>
                                    </div>
                                </div>

                                <div className="admin-reservation-details__client">
                                    <div>
                                        <span>
                                            Nom
                                        </span>

                                        <strong>
                                            {reservation
                                                .user
                                                ?.name ||
                                                "Non disponible"}
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
                            </section>

                            <section className="admin-reservation-details__card">
                                <div className="admin-reservation-details__card-heading">
                                    <div>
                                        <span className="home__eyebrow">
                                            Historique
                                        </span>

                                        <h2>
                                            Informations
                                        </h2>
                                    </div>
                                </div>

                                <div className="admin-reservation-details__history">
                                    <div>
                                        <span>
                                            Créée le
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                reservation.created_at
                                            )}
                                        </strong>
                                    </div>

                                    {reservation.cancelled_at && (
                                        <div>
                                            <span>
                                                Annulée le
                                            </span>

                                            <strong>
                                                {formatDateTime(
                                                    reservation.cancelled_at
                                                )}
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="admin-reservation-details__total">
                                <span>
                                    Montant total
                                </span>

                                <strong>
                                    {
                                        reservation.total_amount
                                    }{" "}
                                    DH
                                </strong>

                                <small>
                                    {
                                        reservation.seats
                                            ?.length || 0
                                    }{" "}
                                    siège
                                    {(reservation.seats
                                        ?.length || 0) >
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    réservé
                                    {(reservation.seats
                                        ?.length || 0) >
                                    1
                                        ? "s"
                                        : ""}
                                </small>
                            </section>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminReservationDetails;
