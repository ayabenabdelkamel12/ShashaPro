import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Layout from "../components/layout/Layout";
import Movies from "../pages/client/Movies";
import MovieDetails from "../pages/client/MovieDetails";
import SeatSelection from "../pages/client/SeatSelection";
import ReservationDetails from "../pages/client/ReservationDetails";
import MyReservations from "../pages/client/MyReservations";
import AdminMovies from "../pages/admin/AdminMovies";
import CreateMovie from "../pages/admin/CreateMovie";
import EditMovie from "../pages/admin/EditMovie";
import AdminRooms from "../pages/admin/AdminRooms";
import CreateRoom from "../pages/admin/CreateRoom";
import EditRoom from "../pages/admin/EditRoom";
import AdminSeats from "../pages/admin/AdminSeats";
import AdminShowtimes from "../pages/admin/AdminShowtimes";
import CreateShowtime from "../pages/admin/CreateShowtime";
import EditShowtime from "../pages/admin/EditShowtime";
import AdminReservations from "../pages/admin/AdminReservations";
import AdminReservationDetails from "../pages/admin/AdminReservationDetails";
import VerifyReservation from "../pages/admin/VerifyReservation";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movies/:id" element={<MovieDetails />} />
                    {/* Client protected */}
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/showtimes/:id/seats"
                            element={<SeatSelection />}
                        />
                        <Route
                            path="/reservations/:id"
                            element={<ReservationDetails />}
                        />
                        <Route
                            path="/my-reservations"
                            element={<MyReservations />}
                        />
                    </Route>

                    {/* Admin protected */}
                    <Route element={<AdminRoute />}>
                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/movies"
                            element={<AdminMovies />}
                        />

                        <Route
                            path="/admin/movies/create"
                            element={<CreateMovie />}
                        />

                        <Route
                            path="/admin/movies/:id/edit"
                            element={<EditMovie />}
                        />

                        <Route
                            path="/admin/rooms"
                            element={<AdminRooms />}
                        />

                        <Route
                            path="/admin/rooms/create"
                            element={<CreateRoom />}
                        />

                        <Route
                            path="/admin/rooms/:id/edit"
                            element={<EditRoom />}
                        />
                        <Route
                            path="/admin/rooms/:id/seats"
                            element={<AdminSeats />}
                        />
                        <Route
                            path="/admin/showtimes"
                            element={<AdminShowtimes />}
                        />

                        <Route
                            path="/admin/showtimes/create"
                            element={<CreateShowtime />}
                        />

                        <Route
                            path="/admin/showtimes/:id/edit"
                            element={<EditShowtime />}
                        />
                        <Route
                            path="/admin/reservations"
                            element={<AdminReservations />}
                        />

                        <Route
                            path="/admin/reservations/verify"
                            element={<VerifyReservation />}
                        />

                        <Route
                            path="/admin/reservations/:id"
                            element={<AdminReservationDetails />}
                        />

                        
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;