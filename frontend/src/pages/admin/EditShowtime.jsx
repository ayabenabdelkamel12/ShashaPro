import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShowtimeForm from "../../components/showtimes/ShowtimeForm";
import {
    getAdminShowtime,
    updateShowtime,
} from "../../services/adminShowtimeService";
import {
    getAdminMovies,
} from "../../services/adminMovieService";
import {
    getAdminRooms,
} from "../../services/adminRoomService";

function EditShowtime() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState(null);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] =
        useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    showtimeData,
                    moviesData,
                    roomsData,
                ] = await Promise.all([
                    getAdminShowtime(id),
                    getAdminMovies(),
                    getAdminRooms(),
                ]);

                setShowtime(showtimeData.showtime);
                setMovies(moviesData.movies || []);
                setRooms(roomsData.rooms || []);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger la séance."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (showtimeData) => {
        try {
            setSubmitLoading(true);

            await updateShowtime(
                id,
                showtimeData
            );

            navigate("/admin/showtimes");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="edit-showtime-page">
                <div className="container edit-showtime__state">
                    <div className="loading">
                        Chargement de la séance...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="edit-showtime-page">
                <div className="container edit-showtime__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!showtime) {
        return (
            <main className="edit-showtime-page">
                <div className="container edit-showtime__state">
                    <div className="empty-state">
                        <div className="admin-showtimes__empty-icon">
                            ✦
                        </div>

                        <h3>Séance introuvable</h3>

                        <p>
                            La séance demandée n'existe pas ou
                            n'est plus disponible.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="edit-showtime-page">
            <section className="edit-showtime__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Modifier la
                        <span> séance.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Modifiez les informations de cette
                        projection et enregistrez les
                        changements.
                    </p>
                </div>
            </section>

            <section className="section edit-showtime__main">
                <div className="container">
                    <div className="edit-showtime__content">
                        <ShowtimeForm
                            initialData={showtime}
                            movies={movies}
                            rooms={rooms}
                            onSubmit={handleSubmit}
                            loading={submitLoading}
                            submitLabel="Enregistrer les modifications"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default EditShowtime;
