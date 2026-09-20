import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowtimeForm from "../../components/showtimes/ShowtimeForm";
import {
    createShowtime,
} from "../../services/adminShowtimeService";
import {
    getAdminMovies,
} from "../../services/adminMovieService";
import {
    getAdminRooms,
} from "../../services/adminRoomService";

function CreateShowtime() {
    const navigate = useNavigate();

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

                const [moviesData, roomsData] =
                    await Promise.all([
                        getAdminMovies(),
                        getAdminRooms(),
                    ]);

                setMovies(moviesData.movies || []);
                setRooms(roomsData.rooms || []);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger les données."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (showtimeData) => {
        try {
            setSubmitLoading(true);

            await createShowtime(showtimeData);

            navigate("/admin/showtimes");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="create-showtime-page">
                <div className="container create-showtime__state">
                    <div className="loading">
                        Chargement des données...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="create-showtime-page">
                <div className="container create-showtime__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="create-showtime-page">
            <section className="create-showtime__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Ajouter une
                        <span> séance.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Programmez une nouvelle projection en
                        choisissant le film, la salle, l'horaire
                        et le tarif.
                    </p>
                </div>
            </section>

            <section className="section create-showtime__main">
                <div className="container">
                    <div className="create-showtime__content">
                        <ShowtimeForm
                            movies={movies}
                            rooms={rooms}
                            onSubmit={handleSubmit}
                            loading={submitLoading}
                            submitLabel="Ajouter la séance"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CreateShowtime;
