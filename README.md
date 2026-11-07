# ShashaPro 🎬

**Cinema Management & Movie Ticket Reservation System**

ShashaPro is a full-stack web application designed to simplify cinema management and movie ticket reservations. It allows customers to explore movies, check showtimes, select seats, and manage their reservations through an intuitive interface.

The platform also provides an administration dashboard for managing cinema operations.

## ✨ Features

### 👤 Customer Area
- User registration and authentication.
- Browse available movies.
- View detailed movie information.
- Explore available showtimes.
- Interactive seat selection.
- Book movie tickets.
- View reservation history.
- Access reservation details.
- Cancel reservations.

### 🛠️ Admin Dashboard
- Dashboard with statistics.
- Movie management (Create, Read, Update, Delete).
- Cinema room management.
- Seat management and generation.
- Showtime management.
- Reservation management.
- Reservation verification using booking codes.

## 🧰 Technologies Used

| Frontend | Backend | Database |
|---|---|---|
| React 19 | PHP 8.2+ | MySQL |
| Vite | Laravel 12 | |
| React Router | Laravel Sanctum | |
| Axios | REST API | |
| QRCode React | | |

## 🏗️ Project Architecture

ShashaPro follows a client-server architecture:

- **Frontend:** React application responsible for the user interface.
- **Backend:** Laravel REST API responsible for business logic and authentication.
- **Database:** MySQL for storing application data.
- **Authentication:** Laravel Sanctum for protected API access.

## 📁 Project Structure

```text
ShashaPro/
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   ├── Models/
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── config/
│   ├── public/
│   ├── composer.json
│   └── artisan
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- PHP 8.2 or higher.
- Composer.
- Node.js and npm.
- MySQL.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/ayabenabdelkamel12/ShashaPro.git

cd ShashaPro
```

### 2. Backend Setup (Laravel)

Navigate to the backend directory:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
copy .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Create a MySQL database named `shashapro` and configure your database credentials in the `.env` file.

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

The backend API will be available at:

`http://127.0.0.1:8000`

### 3. Frontend Setup (React)

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL displayed by Vite.

## 🗄️ Database

ShashaPro uses MySQL with Laravel migrations to manage its database structure.

The database includes entities for:

- Users
- Movies
- Cinema rooms
- Seats
- Showtimes
- Reservations
- Reservation seats
- Personal access tokens

To create the database tables:

```bash
php artisan migrate
```

## 🔐 Authentication & Authorization

- Laravel Sanctum handles API authentication.
- Protected routes require authentication.
- Admin middleware restricts access to administrative features.
- The application separates customer and administrator functionalities.

## 👩‍💻 Author

**Aya Benabdelkamel**

Full-Stack Development Project

---

*ShashaPro — Cinema Management & Movie Ticket Reservation System.*