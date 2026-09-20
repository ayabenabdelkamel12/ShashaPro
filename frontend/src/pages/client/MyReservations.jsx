import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyReservations,
  cancelReservation,
} from "../../services/reservationService";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyReservations();

      setReservations(data.reservations || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Impossible de charger vos réservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

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

      await cancelReservation(reservationId);

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

  const formatDate = (date) => {
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
      <main className="my-reservations-page">
        <div className="container">
          <div className="loading">
            Chargement de vos réservations...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-reservations-page">
      <section className="my-reservations__header">
        <div className="container">
          <span className="home__eyebrow">
            ✦ Espace client
          </span>

          <h1>
            Mes
            <span> réservations.</span>
          </h1>

          <div className="gold-line" />

          <p>
            Retrouvez ici toutes vos réservations et vos
            tickets cinéma.
          </p>
        </div>
      </section>

      <section className="section my-reservations__main">
        <div className="container">
          {error && (
            <div className="alert alert-danger my-reservations__error">
              {error}
            </div>
          )}

          {!error && reservations.length === 0 && (
            <div className="empty-state my-reservations__empty">
              <div className="my-reservations__empty-icon">
                ✦
              </div>

              <h3>Aucune réservation</h3>

              <p>
                Vous n'avez encore aucune réservation.
                Découvrez notre programmation et choisissez
                votre prochaine séance.
              </p>

              <Link
                to="/movies"
                className="home__btn home__btn--primary"
              >
                Voir les films
              </Link>
            </div>
          )}

          {reservations.length > 0 && (
            <>
              <div className="my-reservations__intro">
                <div>
                  <span className="home__eyebrow">
                    Votre historique
                  </span>

                  <h2>
                    {reservations.length}{" "}
                    {reservations.length > 1
                      ? "réservations"
                      : "réservation"}
                  </h2>
                </div>

                <Link
                  to="/movies"
                  className="home__btn home__btn--outline"
                >
                  Découvrir les films
                </Link>
              </div>

              <div className="my-reservations__list">
                {reservations.map((reservation) => {
                  const isConfirmed =
                    reservation.status === "confirmed";

                  return (
                    <article
                      key={reservation.id}
                      className={`reservation-card ${
                        isConfirmed
                          ? "reservation-card--confirmed"
                          : "reservation-card--cancelled"
                      }`}
                    >
                      <div className="reservation-card__top">
                        <div className="reservation-card__movie">
                          <span className="reservation-card__label">
                            FILM
                          </span>

                          <h2>
                            {reservation.showtime?.movie?.title ||
                              "Film"}
                          </h2>
                        </div>

                        <span
                          className={`badge ${
                            isConfirmed
                              ? "badge-gold"
                              : "reservation-card__cancelled-badge"
                          }`}
                        >
                          {isConfirmed
                            ? "Confirmée"
                            : "Annulée"}
                        </span>
                      </div>

                      <div className="reservation-card__code">
                        <span>CODE DE RÉSERVATION</span>

                        <strong>
                          {reservation.booking_code}
                        </strong>
                      </div>

                      <div className="reservation-card__info">
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
                            {formatDate(
                              reservation.showtime?.start_time
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>SIÈGES</span>

                          <strong>
  {reservation.reservation_seats?.length > 0
    ? reservation.reservation_seats
        .map(
          (reservationSeat) =>
            `${reservationSeat.seat?.row_label}${reservationSeat.seat?.seat_number}`
        )
        .join(", ")
    : "Aucun"}
</strong>
                        </div>

                        <div>
                          <span>TOTAL</span>

                          <strong>
                            {reservation.total_amount} DH
                          </strong>
                        </div>
                      </div>

                      <div className="reservation-card__bottom">
                        <Link
                          to={`/reservations/${reservation.id}`}
                          className="reservation-card__details"
                        >
                          Voir les détails
                          <span>→</span>
                        </Link>

                        {isConfirmed && (
                          <button
                            type="button"
                            className="reservation-card__cancel"
                            onClick={() =>
                              handleCancel(reservation.id)
                            }
                            disabled={
                              cancelLoading === reservation.id
                            }
                          >
                            {cancelLoading === reservation.id
                              ? "Annulation..."
                              : "Annuler la réservation"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default MyReservations;
