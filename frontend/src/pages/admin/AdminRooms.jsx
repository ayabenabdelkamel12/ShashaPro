import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAdminRooms,
    deleteRoom,
} from "../../services/adminRoomService";

function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminRooms();

            setRooms(data.rooms || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de charger les salles."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const handleDelete = async (roomId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette salle ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(roomId);
            setError("");

            await deleteRoom(roomId);

            await loadRooms();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Impossible de supprimer la salle."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <main className="admin-rooms-page">
                <div className="container admin-rooms__state">
                    <div className="loading">
                        Chargement des salles...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-rooms-page">
            <section className="admin-rooms__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Gestion des
                        <span> salles.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Gérez les salles de votre cinéma,
                        leur capacité et leurs sièges.
                    </p>
                </div>
            </section>

            <section className="section admin-rooms__main">
                <div className="container">
                    <div className="admin-rooms__toolbar">
                        <div>
                            <span className="home__eyebrow">
                                Infrastructure
                            </span>

                            <h2>
                                {rooms.length}{" "}
                                {rooms.length > 1
                                    ? "salles"
                                    : "salle"}
                            </h2>
                        </div>

                        <Link
                            to="/admin/rooms/create"
                            className="home__btn home__btn--primary"
                        >
                            + Ajouter une salle
                        </Link>
                    </div>

                    {error && (
                        <div className="alert alert-danger admin-rooms__error">
                            {error}
                        </div>
                    )}

                    {!error && rooms.length === 0 && (
                        <div className="empty-state admin-rooms__empty">
                            <div className="admin-rooms__empty-icon">
                                ✦
                            </div>

                            <h3>Aucune salle trouvée</h3>

                            <p>
                                Votre cinéma ne contient
                                actuellement aucune salle.
                            </p>

                            <Link
                                to="/admin/rooms/create"
                                className="home__btn home__btn--primary"
                            >
                                Ajouter la première salle
                            </Link>
                        </div>
                    )}

                    {rooms.length > 0 && (
                        <div className="admin-rooms__grid">
                            {rooms.map((room) => (
                                <article
                                    key={room.id}
                                    className="admin-room-card"
                                >
                                    <div className="admin-room-card__top">
                                        <div className="admin-room-card__icon">
                                            S
                                        </div>

                                        <span className="admin-room-card__label">
                                            SALLE
                                        </span>
                                    </div>

                                    <div className="admin-room-card__content">
                                        <h2>{room.name}</h2>

                                        <div className="admin-room-card__stats">
                                            <div>
                                                <span>
                                                    Capacité
                                                </span>

                                                <strong>
                                                    {room.capacity}
                                                </strong>

                                                <small>
                                                    places
                                                </small>
                                            </div>

                                            <div>
                                                <span>
                                                    Sièges
                                                </span>

                                                <strong>
                                                    {room.seats_count ??
                                                        room.seats
                                                            ?.length ??
                                                        0}
                                                </strong>

                                                <small>
                                                    installés
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-room-card__actions">
                                        <Link
                                            to={`/admin/rooms/${room.id}/seats`}
                                            className="admin-room-card__seats"
                                        >
                                            Gérer les sièges
                                            <span>→</span>
                                        </Link>

                                        <div className="admin-room-card__secondary-actions">
                                            <Link
                                                to={`/admin/rooms/${room.id}/edit`}
                                                className="admin-room-card__edit"
                                            >
                                                Modifier
                                            </Link>

                                            <button
                                                type="button"
                                                className="admin-room-card__delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        room.id
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading ===
                                                    room.id
                                                }
                                            >
                                                {deleteLoading ===
                                                room.id
                                                    ? "Suppression..."
                                                    : "Supprimer"}
                                            </button>
                                        </div>
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

export default AdminRooms;
