import { useEffect, useState } from "react";
import { getStatistics } from "../../services/statisticsService";

function AdminDashboard() {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStatistics = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getStatistics();

                setStatistics(data.statistics);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                        "Impossible de charger les statistiques."
                );
            } finally {
                setLoading(false);
            }
        };

        loadStatistics();
    }, []);

    if (loading) {
        return (
            <main className="admin-dashboard-page">
                <div className="container">
                    <div className="loading">
                        Chargement des statistiques...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-dashboard-page">
                <div className="container admin-dashboard-page__state">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!statistics) {
        return (
            <main className="admin-dashboard-page">
                <div className="container admin-dashboard-page__state">
                    <div className="empty-state">
                        <h3>Aucune statistique disponible</h3>
                        <p>
                            Les données du tableau de bord ne sont
                            actuellement pas disponibles.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const statCards = [
        {
            label: "Films actifs",
            value: statistics.active_movies,
            type: "primary",
        },
        {
            label: "Films total",
            value: statistics.total_movies,
            type: "secondary",
        },
        {
            label: "Séances",
            value: statistics.active_showtimes,
            type: "primary",
        },
        {
            label: "Clients",
            value: statistics.total_clients,
            type: "secondary",
        },
        {
            label: "Réservations",
            value: statistics.total_reservations,
            type: "primary",
        },
        {
            label: "Confirmées",
            value: statistics.confirmed_reservations,
            type: "gold",
        },
        {
            label: "Annulées",
            value: statistics.cancelled_reservations,
            type: "muted",
        },
        {
            label: "Tickets vendus",
            value: statistics.total_tickets_sold,
            type: "gold",
        },
    ];

    return (
        <main className="admin-dashboard-page">
            <section className="admin-dashboard__header">
                <div className="container">
                    <span className="home__eyebrow">
                        ✦ Administration
                    </span>

                    <h1>
                        Dashboard
                        <span> ShashaPro.</span>
                    </h1>

                    <div className="gold-line" />

                    <p>
                        Vue globale de l'activité de votre cinéma,
                        des réservations et des performances.
                    </p>
                </div>
            </section>

            <section className="section admin-dashboard__main">
                <div className="container">
                    <div className="admin-dashboard__stats">
                        {statCards.map((stat) => (
                            <article
                                key={stat.label}
                                className={`admin-stat-card admin-stat-card--${stat.type}`}
                            >
                                <span className="admin-stat-card__label">
                                    {stat.label}
                                </span>

                                <strong className="admin-stat-card__value">
                                    {stat.value}
                                </strong>
                            </article>
                        ))}
                    </div>

                    <div className="admin-dashboard__revenue">
                        <div>
                            <span className="home__eyebrow">
                                Performance
                            </span>

                            <h2>Chiffre d'affaires</h2>

                            <p>
                                Revenus générés par les réservations
                                enregistrées sur ShashaPro.
                            </p>
                        </div>

                        <strong>
                            {statistics.total_revenue} DH
                        </strong>
                    </div>

                    <section className="admin-dashboard__popular">
                        <div className="admin-dashboard__section-heading">
                            <div>
                                <span className="home__eyebrow">
                                    ✦ Analyse
                                </span>

                                <h2>Films les plus populaires</h2>
                            </div>
                        </div>

                        {statistics.popular_movies?.length === 0 ? (
                            <div className="empty-state">
                                <h3>Aucune donnée disponible</h3>
                                <p>
                                    Il n'y a actuellement aucune
                                    donnée concernant les films
                                    populaires.
                                </p>
                            </div>
                        ) : (
                            <div className="admin-popular-list">
                                {statistics.popular_movies?.map(
                                    (movie, index) => (
                                        <article
                                            key={movie.id}
                                            className="admin-popular-item"
                                        >
                                            <div className="admin-popular-item__rank">
                                                {String(
                                                    index + 1
                                                ).padStart(2, "0")}
                                            </div>

                                            <div className="admin-popular-item__movie">
                                                <strong>
                                                    {movie.title}
                                                </strong>

                                                <span>
                                                    Performance du
                                                    film
                                                </span>
                                            </div>

                                            <div className="admin-popular-item__tickets">
                                                <strong>
                                                    {
                                                        movie.tickets_sold
                                                    }
                                                </strong>

                                                <span>
                                                    {movie.tickets_sold >
                                                    1
                                                        ? "tickets"
                                                        : "ticket"}
                                                </span>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}

export default AdminDashboard;
