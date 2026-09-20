import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getReservation } from "../../services/reservationService";

function ReservationDetails() {
    const { id } = useParams();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReservation = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getReservation(id);

                setReservation(data.reservation);
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

    if (loading) {
        return (
            <main className="reservation-details-page">
                <div className="container">
                    <div className="loading">
                        Chargement de la réservation...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="reservation-details-page">
                <div className="container reservation-details-page__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!reservation) {
        return (
            <main className="reservation-details-page">
                <div className="container reservation-details-page__state">
                    <div className="empty-state">
                        <h3>Réservation introuvable</h3>
                        <p>
                            Cette réservation n'existe pas ou n'est plus
                            disponible.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const isConfirmed = reservation.status === "confirmed";

    return (
        <main className="reservation-details-page">
            {/* =====================================================
                STATUS HEADER
            ====================================================== */}

            <section
                className={`reservation-details__header ${
                    isConfirmed
                        ? "reservation-details__header--confirmed"
                        : "reservation-details__header--cancelled"
                }`}
            >
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ ShashaPro
                    </span>

                    <div className="reservation-details__status-icon">
                        {isConfirmed ? "✓" : "×"}
                    </div>

                    <h1>
                        {isConfirmed
                            ? "Réservation confirmée"
                            : "Réservation annulée"}
                    </h1>

                    <p>
                        {isConfirmed
                            ? "Votre réservation a été créée avec succès."
                            : "Cette réservation a été annulée."}
                    </p>
                </div>
            </section>

            {/* =====================================================
                TICKET
            ====================================================== */}

            <section className="section reservation-details__main">
                <div className="container">
                    <div
                        className={`reservation-ticket ${
                            !isConfirmed
                                ? "reservation-ticket--cancelled"
                                : ""
                        }`}
                    >
                        {/* TICKET TOP */}

                        <div className="reservation-ticket__top">
                            <div>
                                <span className="reservation-ticket__brand">
                                    SHASHAPRO
                                </span>

                                <span className="reservation-ticket__type">
                                    TICKET CINÉMA
                                </span>
                            </div>

                            <span className="reservation-ticket__star">
                                ✦
                            </span>
                        </div>

                        {/* FILM */}

                        <div className="reservation-ticket__movie">
                            <span>FILM</span>

                            <h2>
                                {reservation.showtime?.movie?.title ||
                                    "Film"}
                            </h2>
                        </div>

                        {/* INFO */}

                        <div className="reservation-ticket__info">
                            <div>
                                <span>SALLE</span>
                                <strong>
                                    {reservation.showtime?.room?.name ||
                                        "Salle"}
                                </strong>
                            </div>

                            <div>
                                <span>SÉANCE</span>
                                <strong>
                                    {reservation.showtime?.start_time
    ? new Date(
          reservation.showtime.start_time
      ).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
      })
    : "Non disponible"}
                                </strong>
                            </div>

                            <div>
                                <span>PRIX / SIÈGE</span>
                                <strong>
                                    {reservation.showtime?.price || "0"} DH
                                </strong>
                            </div>
                        </div>

                        {/* DIVIDER */}

                        <div className="reservation-ticket__divider">
                            <span />
                            <span />
                        </div>

                        {/* SEATS + QR */}

                        <div className="reservation-ticket__body">
                            <div className="reservation-ticket__seats">
                                <span>SIÈGES</span>

                                {reservation.seats?.length > 0 ? (
                                    <div className="reservation-ticket__seat-list">
                                        {reservation.seats.map((seat) => (
                                            <span
                                                key={seat.id}
                                                className="reservation-ticket__seat"
                                            >
                                                {seat.row_label}
                                                {seat.seat_number}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Aucun siège trouvé.</p>
                                )}
                            </div>

                            {isConfirmed && (
                                <div className="reservation-ticket__qr">
                                    <QRCodeSVG
                                        value={reservation.booking_code}
                                        size={180}
                                        bgColor="#ffffff"
                                        fgColor="#4a0d14"
                                        level="M"
                                    />

                                    <span>
                                        Présentez ce QR code
                                        lors du contrôle.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* BOOKING CODE */}

                        <div className="reservation-ticket__code">
                            <span>CODE DE RÉSERVATION</span>

                            <strong>
                                {reservation.booking_code}
                            </strong>
                        </div>

                        {/* TOTAL */}

                        <div className="reservation-ticket__bottom">
                            <div>
                                <span>
                                    {reservation.seats?.length || 0} siège
                                    {reservation.seats?.length > 1
                                        ? "s"
                                        : ""}
                                </span>

                                <small>
                                    Statut :{" "}
                                    {isConfirmed
                                        ? "Confirmée"
                                        : "Annulée"}
                                </small>
                            </div>

                            <div className="reservation-ticket__total">
                                <span>TOTAL</span>
                                <strong>
                                    {reservation.total_amount} DH
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="reservation-details__actions">
                        <Link
                            to="/my-reservations"
                            className="home__btn home__btn--primary"
                        >
                            Mes réservations
                        </Link>

                        <Link
                            to="/movies"
                            className="home__btn home__btn--outline"
                        >
                            Retour aux films
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ReservationDetails;
