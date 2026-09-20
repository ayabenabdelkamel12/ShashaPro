import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home">
            {/* HERO */}
            <section className="home__hero">
                <div className="container home__hero-inner">
                    <div className="home__hero-content">
                        <span className="home__eyebrow">
                            ✦ Votre cinéma, autrement
                        </span>

                        <h1>
                            Vivez le cinéma
                            <span> en grand.</span>
                        </h1>

                        <p>
                            Découvrez les meilleurs films, choisissez votre
                            séance et réservez vos places en quelques clics.
                        </p>

                       <div className="home__hero-actions">
    <Link
        to="/movies"
        className="home__btn home__btn--primary"
    >
        Découvrir les films
    </Link>

    <Link
        to="/register"
        className="home__btn home__btn--outline"
    >
        Créer un compte
    </Link>
</div>
                    </div>

                    <div className="home__hero-visual">
                        <div className="home__ticket-card">
                            <div className="home__ticket-top">
                                <span>SHASHAPRO</span>
                                <span>✦</span>
                            </div>

                            <div className="home__ticket-content">
                                <span className="home__ticket-label">
                                    PROJECTION
                                </span>

                                <h2>Votre prochaine séance</h2>

                                <div className="home__ticket-line" />

                                <div className="home__ticket-info">
                                    <div>
                                        <small>EXPÉRIENCE</small>
                                        <strong>CINÉMA</strong>
                                    </div>

                                    <div>
                                        <small>RÉSERVATION</small>
                                        <strong>EN LIGNE</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="home__ticket-bottom">
                                <span>✦ ✦ ✦</span>
                                <span>SHASHAPRO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section home__features">
                <div className="container">
                    <div className="section-title home__section-heading">
    <span className="home__eyebrow">
        Une expérience simple
    </span>

    <h2>
        Tout ce qu'il faut
        <span> pour votre séance.</span>
    </h2>

    <div className="gold-line" />

    <p>
        ShashaPro vous accompagne de la découverte du film
        jusqu'à votre entrée en salle.
    </p>
</div>

                    <div className="home__feature-grid">
                        <article className="card home__feature-card">
                            <div className="home__feature-icon">01</div>

                            <h3>Découvrez</h3>

                            <p>
                                Parcourez les films disponibles et consultez
                                leurs informations.
                            </p>
                        </article>

                        <article className="card home__feature-card">
                            <div className="home__feature-icon">02</div>

                            <h3>Choisissez</h3>

                            <p>
                                Sélectionnez votre séance et choisissez les
                                sièges qui vous conviennent.
                            </p>
                        </article>

                        <article className="card home__feature-card">
                            <div className="home__feature-icon">03</div>

                            <h3>Réservez</h3>

                            <p>
                                Confirmez votre réservation et retrouvez votre
                                ticket avec son QR code.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home__cta">
                <div className="container home__cta-inner">
                    <div>
                        <span className="home__eyebrow">
                            Prêt pour la séance ?
                        </span>

                        <h2>Choisissez votre prochain film.</h2>

                        <p>
                            Explorez notre programmation et préparez votre
                            prochaine expérience cinéma.
                        </p>
                    </div>

                    <Link
    to="/movies"
    className="home__btn home__btn--gold"
>
    Voir les films
</Link>
                </div>
            </section>
        </main>
    );
}

export default Home;