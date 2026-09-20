import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const isAdmin = isAuthenticated && user?.role === "admin";

    return (
        <header className="navbar">
            <nav className="navbar__inner">
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">S</span>

                    <span className="navbar__logo-text">
                        Shasha<span>Pro</span>
                    </span>
                </Link>

                <div className="navbar__links">
                    {/* Lien commun */}
                    <Link
                        to="/"
                        className={
                            isActive("/")
                                ? "navbar__link navbar__link--active"
                                : "navbar__link"
                        }
                    >
                        Accueil
                    </Link>

                    {/* Navigation publique uniquement pour visiteurs/clients */}
                    {!isAdmin && (
                        <Link
                            to="/movies"
                            className={
                                isActive("/movies")
                                    ? "navbar__link navbar__link--active"
                                    : "navbar__link"
                            }
                        >
                            Films
                        </Link>
                    )}

                    {/* Navigation client */}
                    {isAuthenticated && user?.role === "client" && (
                        <Link
                            to="/my-reservations"
                            className={
                                isActive("/my-reservations")
                                    ? "navbar__link navbar__link--active"
                                    : "navbar__link"
                            }
                        >
                            Mes réservations
                        </Link>
                    )}

                    {/* Navigation admin */}
                    {isAdmin && (
                        <>
                            <Link
                                to="/admin"
                                className={
                                    isActive("/admin")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/admin/movies"
                                className={
                                    isActive("/admin/movies")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Films
                            </Link>

                            <Link
                                to="/admin/rooms"
                                className={
                                    isActive("/admin/rooms")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Salles
                            </Link>

                            <Link
                                to="/admin/showtimes"
                                className={
                                    isActive("/admin/showtimes")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Séances
                            </Link>

                            <Link
                                to="/admin/reservations"
                                className={
                                    isActive("/admin/reservations")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Réservations
                            </Link>

                            <Link
                                to="/admin/reservations/verify"
                                className={
                                    isActive("/admin/reservations/verify")
                                        ? "navbar__link navbar__link--active"
                                        : "navbar__link"
                                }
                            >
                                Vérifier ticket
                            </Link>
                        </>
                    )}
                </div>

                <div className="navbar__user">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="navbar__login"
                            >
                                Connexion
                            </Link>

                            <Link
                                to="/register"
                                className="navbar__register"
                            >
                                Inscription
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="navbar__welcome">
                                Bonjour, <strong>{user.name}</strong>
                            </span>

                            <button
                                type="button"
                                className="navbar__logout"
                                onClick={handleLogout}
                            >
                                Déconnexion
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
