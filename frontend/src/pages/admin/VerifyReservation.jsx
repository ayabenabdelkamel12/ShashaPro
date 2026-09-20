import { useState } from "react";
import { Link } from "react-router-dom";
import {
    verifyReservation,
} from "../../services/adminReservationService";

function VerifyReservation() {
    const [bookingCode, setBookingCode] =
        useState("");

    const [reservation, setReservation] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!bookingCode.trim()) {
            setError(
                "Veuillez saisir un code de réservation."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setReservation(null);

            const data =
                await verifyReservation(
                    bookingCode.trim()
                );

            setReservation(
                data.reservation
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Réservation invalide ou introuvable."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (date) => {
        if (!date) {
            return "Non disponible";
        }

        return new Date(date).toLocaleString(
            "fr-FR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatSeats = () => {
        if (
            !reservation?.seats ||
            reservation.seats.length === 0
        ) {
            return "Aucun";
        }

        return reservation.seats
            .map(
                (seat) =>
                    `${seat.row_label}${seat.seat_number}`
            )
            .join(", ");
    };

    return (
        <main className="verify-reservation-page">
            <section className="verify-reservation__header">
                <div className="container">
                    <Link
                        to="/admin/reservations"
                        className="verify-reservation__back"
                    >
                        ← Retour aux réservations
                    </Link>

                    <span className="home__eyebrow">
                        ✦ Contrôle des billets
                    </span>

                    <h1>
                        Vérifier une
                        <span> réservation.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Vérifiez rapidement la validité
                        d'un ticket à partir de son code
                        de réservation.
                    </p>
                </div>
            </section>

            <section className="section verify-reservation__main">
                <div className="container">
                    <div className="verify-reservation__layout">
                        <div className="verify-reservation__form-card">
                            <div className="verify-reservation__icon">
                                ✓
                            </div>

                            <div className="verify-reservation__form-heading">
                                <span className="home__eyebrow">
                                    Vérification
                                </span>

                                <h2>
                                    Contrôler un ticket
                                </h2>

                                <p>
                                    Saisissez le code indiqué
                                    sur le ticket du client.
                                </p>
                            </div>

                            <form
                                className="verify-reservation__form"
                                onSubmit={handleSubmit}
                            >
                                <div className="verify-reservation__field">
                                    <label htmlFor="booking_code">
                                        Code de réservation
                                    </label>

                                    <div className="verify-reservation__input-wrap">
                                        <span className="verify-reservation__input-icon">
                                            #
                                        </span>

                                        <input
                                            id="booking_code"
                                            type="text"
                                            value={bookingCode}
                                            onChange={(event) =>
                                                setBookingCode(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="SHA-XXXXXXXXXX"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>

                                    <span className="verify-reservation__hint">
                                        Exemple : SHA-6DRK3EO7IN
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="home__btn home__btn--primary verify-reservation__submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="verify-reservation__spinner" />
                                            Vérification...
                                        </>
                                    ) : (
                                        <>
                                            Vérifier le ticket
                                            <span>→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="alert alert-danger verify-reservation__error">
                                    <span className="verify-reservation__error-icon">
                                        !
                                    </span>

                                    <div>
                                        <strong>
                                            Vérification échouée
                                        </strong>

                                        <p>
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!reservation && !error && (
                            <div className="verify-reservation__guide">
                                <div className="verify-reservation__guide-icon">
                                    ✓
                                </div>

                                <span className="home__eyebrow">
                                    ShashaPro
                                </span>

                                <h3>
                                    Contrôle rapide
                                </h3>

                                <p>
                                    Utilisez le code unique
                                    présent sur chaque ticket
                                    pour retrouver les
                                    informations de la
                                    réservation.
                                </p>

                                <div className="verify-reservation__guide-steps">
                                    <div className="verify-reservation__guide-step">
                                        <span>01</span>
                                        <div>
                                            <strong>
                                                Saisir le code
                                            </strong>
                                            <small>
                                                Entrez le code du
                                                ticket.
                                            </small>
                                        </div>
                                    </div>

                                    <div className="verify-reservation__guide-step">
                                        <span>02</span>
                                        <div>
                                            <strong>
                                                Vérifier
                                            </strong>
                                            <small>
                                                ShashaPro recherche
                                                la réservation.
                                            </small>
                                        </div>
                                    </div>

                                    <div className="verify-reservation__guide-step">
                                        <span>03</span>
                                        <div>
                                            <strong>
                                                Contrôler
                                            </strong>
                                            <small>
                                                Consultez les
                                                détails du ticket.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {reservation && (
                            <div className="verify-reservation__result">
                                <div className="verify-reservation__result-top">
                                    <div className="verify-reservation__valid-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <span className="home__eyebrow">
                                            Vérification réussie
                                        </span>

                                        <h2>
                                            Réservation valide
                                        </h2>

                                        <p>
                                            Le ticket a été
                                            retrouvé avec succès.
                                        </p>
                                    </div>

                                    <span className="verify-reservation__valid-badge">
                                        VALIDE
                                    </span>
                                </div>

                                <div className="verify-reservation__ticket">
                                    <div className="verify-reservation__ticket-heading">
                                        <span>
                                            CODE DE RÉSERVATION
                                        </span>

                                        <strong>
                                            {
                                                reservation.booking_code
                                            }
                                        </strong>
                                    </div>

                                    <div className="verify-reservation__ticket-divider" />

                                    <div className="verify-reservation__movie">
                                        <div className="verify-reservation__movie-icon">
                                            🎬
                                        </div>

                                        <div>
                                            <span>
                                                FILM
                                            </span>

                                            <strong>
                                                {reservation
                                                    .showtime
                                                    ?.movie
                                                    ?.title ||
                                                    "Film"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="verify-reservation__info-grid">
                                        <div className="verify-reservation__info-item">
                                            <span>
                                                Client
                                            </span>

                                            <strong>
                                                {reservation.user
                                                    ?.name ||
                                                    "Client"}
                                            </strong>
                                        </div>

                                        <div className="verify-reservation__info-item">
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

                                        <div className="verify-reservation__info-item">
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

                                        <div className="verify-reservation__info-item">
                                            <span>
                                                Sièges
                                            </span>

                                            <strong className="verify-reservation__seats">
                                                {formatSeats()}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="verify-reservation__ticket-bottom">
                                        <div>
                                            <span>
                                                STATUT
                                            </span>

                                            <strong>
                                                {reservation.status}
                                            </strong>
                                        </div>

                                        <div className="verify-reservation__total">
                                            <span>
                                                TOTAL
                                            </span>

                                            <strong>
                                                {
                                                    reservation.total_amount
                                                }{" "}
                                                DH
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="home__btn home__btn--outline verify-reservation__new"
                                    onClick={() => {
                                        setReservation(null);
                                        setError("");
                                        setBookingCode("");
                                    }}
                                >
                                    Vérifier un autre ticket
                                    <span>→</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default VerifyReservation;
