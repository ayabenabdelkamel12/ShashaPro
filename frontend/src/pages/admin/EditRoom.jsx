import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomForm from "../../components/rooms/RoomForm";
import {
    getAdminRoom,
    updateRoom,
} from "../../services/adminRoomService";

function EditRoom() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminRoom(id);

                setRoom(data.room);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger la salle."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [id]);

    const handleSubmit = async (roomData) => {
        try {
            setSubmitLoading(true);

            await updateRoom(id, roomData);

            navigate("/admin/rooms");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="edit-room-page">
                <div className="container edit-room__state">
                    <div className="loading">
                        Chargement de la salle...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="edit-room-page">
                <div className="container edit-room__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!room) {
        return (
            <main className="edit-room-page">
                <div className="container edit-room__state">
                    <div className="empty-state">
                        <h3>Salle introuvable</h3>

                        <p>
                            La salle demandée n'existe pas ou
                            n'est plus disponible.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="edit-room-page">
            <section className="edit-room__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Modifier la
                        <span> salle.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Modifiez les informations de la salle
                        <strong> « {room.name} »</strong>.
                    </p>
                </div>
            </section>

            <section className="section edit-room__main">
                <div className="container">
                    <div className="edit-room__content">
                        <RoomForm
                            initialData={room}
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

export default EditRoom;
