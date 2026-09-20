import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomForm from "../../components/rooms/RoomForm";
import { createRoom } from "../../services/adminRoomService";

function CreateRoom() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (roomData) => {
        try {
            setLoading(true);

            await createRoom(roomData);

            navigate("/admin/rooms");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="create-room-page">
            <section className="create-room__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Ajouter une
                        <span> salle.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Créez une nouvelle salle et définissez
                        sa capacité pour votre cinéma.
                    </p>
                </div>
            </section>

            <section className="section create-room__main">
                <div className="container">
                    <div className="create-room__content">
                        <RoomForm
                            onSubmit={handleSubmit}
                            loading={loading}
                            submitLabel="Ajouter la salle"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CreateRoom;
