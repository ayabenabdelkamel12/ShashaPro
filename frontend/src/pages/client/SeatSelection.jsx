import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShowtime,
  getAvailableSeats,
} from "../../services/showtimeService";
import { createReservation } from "../../services/reservationService";

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSeatData = async () => {
      try {
        setLoading(true);
        setError("");

        const [showtimeData, seatsData] = await Promise.all([
          getShowtime(id),
          getAvailableSeats(id),
        ]);

        setShowtime(showtimeData.showtime);
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

    loadSeatData();
  }, [id]);

  const toggleSeat = (seat) => {
    if (!seat.is_available) {
      return;
    }

    setSelectedSeats((currentSeats) => {
      const alreadySelected = currentSeats.some(
        (selectedSeat) => selectedSeat.id === seat.id
      );

      if (alreadySelected) {
        return currentSeats.filter(
          (selectedSeat) => selectedSeat.id !== seat.id
        );
      }

      return [...currentSeats, seat];
    });
  };

  const handleReservation = async () => {
    if (selectedSeats.length === 0) {
      setError("Veuillez sélectionner au moins un siège.");
      return;
    }

    try {
      setReservationLoading(true);
      setError("");

      const reservationData = {
        showtime_id: Number(id),
        seat_ids: selectedSeats.map((seat) => seat.id),
      };

      const data = await createReservation(reservationData);

      navigate(`/reservations/${data.reservation.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Impossible de créer la réservation."
      );
    } finally {
      setReservationLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="seat-selection-page">
        <div className="container">
          <div className="loading">
            Chargement des sièges...
          </div>
        </div>
      </main>
    );
  }

  if (error && !showtime) {
    return (
      <main className="seat-selection-page">
        <div className="container seat-selection-page__state">
          <div className="alert alert-danger">{error}</div>
        </div>
      </main>
    );
  }

  if (!showtime) {
    return (
      <main className="seat-selection-page">
        <div className="container seat-selection-page__state">
          <div className="empty-state">
            <h3>Séance introuvable</h3>
            <p>
              La séance demandée n'existe pas ou n'est plus disponible.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const total =
    selectedSeats.length * Number(showtime.price);

  return (
    <main className="seat-selection-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="seat-selection__header">
        <div className="container">
          <span className="home__eyebrow">
            ✦ Réservation
          </span>

          <h1>
            Choisissez
            <span> vos sièges.</span>
          </h1>

          <div className="gold-line" />

          <p>
            Sélectionnez vos places pour profiter pleinement
            de votre prochaine séance.
          </p>
        </div>
      </section>

      {/* =====================================================
          SHOWTIME INFO
      ====================================================== */}

      <section className="seat-selection__info">
        <div className="container">
          <div className="seat-selection__info-card">
            <div>
              <span>FILM</span>
              <strong>
                {showtime.movie?.title || "Film"}
              </strong>
            </div>

            <div>
              <span>SALLE</span>
              <strong>
                {showtime.room?.name || "Salle"}
              </strong>
            </div>

            <div>
              <span>SÉANCE</span>
              <strong>
    {new Date(showtime.start_time).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })}
</strong>
            </div>

            <div>
              <span>TARIF</span>
              <strong>{showtime.price} DH / siège</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEAT AREA
      ====================================================== */}

      <section className="section seat-selection__main">
        <div className="container">
          {error && (
            <div className="alert alert-danger seat-selection__error">
              {error}
            </div>
          )}

          <div className="seat-selection__layout">
            {/* SEATS */}

            <div className="seat-selection__room">
              <div className="seat-selection__room-header">
                <div>
                  <span className="home__eyebrow">
                    ✦ Salle
                  </span>

                  <h2>
                    Sélectionnez vos places
                  </h2>
                </div>

                <div className="seat-selection__legend">
                  <span>
                    <i className="seat seat--available" />
                    Disponible
                  </span>

                  <span>
                    <i className="seat seat--selected" />
                    Sélectionné
                  </span>

                  <span>
                    <i className="seat seat--unavailable" />
                    Occupé
                  </span>
                </div>
              </div>

              {/* SCREEN */}

              <div className="seat-selection__screen-wrapper">
                <div className="seat-selection__screen">
                  ÉCRAN
                </div>

                <span>
                  Vue depuis l'écran
                </span>
              </div>

              {/* SEATS */}

              {seats.length === 0 ? (
                <div className="empty-state">
                  <h3>Aucun siège disponible</h3>
                  <p>
                    Cette salle ne contient actuellement aucun
                    siège disponible.
                  </p>
                </div>
              ) : (
                <div className="seat-selection__seats-wrapper">
                  <div className="seat-selection__seats">
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.some(
                        (selectedSeat) =>
                          selectedSeat.id === seat.id
                      );

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          className={`seat ${
                            !seat.is_available
                              ? "seat--unavailable"
                              : isSelected
                              ? "seat--selected"
                              : "seat--available"
                          }`}
                          onClick={() =>
                            toggleSeat(seat)
                          }
                          disabled={!seat.is_available}
                          aria-label={`Siège ${seat.row_label}${seat.seat_number}`}
                        >
                          <span>
                            {seat.row_label}
                            {seat.seat_number}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SUMMARY */}

            <aside className="seat-selection__summary">
              <div className="seat-selection__summary-inner">
                <span className="home__eyebrow">
                  Votre réservation
                </span>

                <h2>Votre sélection</h2>

                <div className="gold-line" />

                {selectedSeats.length === 0 ? (
                  <div className="seat-selection__empty-selection">
                    <span className="seat-selection__empty-icon">
                      ○
                    </span>

                    <p>
                      Aucun siège sélectionné.
                    </p>

                    <small>
                      Cliquez sur un siège disponible
                      pour le sélectionner.
                    </small>
                  </div>
                ) : (
                  <>
                    <div className="seat-selection__selected-list">
                      <span>SIÈGES</span>

                      <div>
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat.id}
                            className="badge badge-burgundy"
                          >
                            {seat.row_label}
                            {seat.seat_number}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="seat-selection__summary-row">
                      <span>Nombre de sièges</span>
                      <strong>
                        {selectedSeats.length}
                      </strong>
                    </div>

                    <div className="seat-selection__summary-row">
                      <span>Prix par siège</span>
                      <strong>
                        {showtime.price} DH
                      </strong>
                    </div>

                    <div className="seat-selection__total">
                      <span>Total</span>
                      <strong>{total} DH</strong>
                    </div>

                    <button
                      type="button"
                      className="seat-selection__confirm"
                      onClick={handleReservation}
                      disabled={reservationLoading}
                    >
                      {reservationLoading
                        ? "Réservation..."
                        : "Confirmer la réservation"}

                      {!reservationLoading && (
                        <span>→</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SeatSelection;

