# Campus Equipment Management System

A web-based campus resource, equipment issuing, and event registration management system with a responsive frontend and an Express/MongoDB backend API.

---

## Project Structure

```
campus-equipment-system/
├── index.html                   # Main client-side single page interface
├── css/
│   └── styles.css               # Application design system & styling
├── js/
│   ├── app.js                   # Client-side ERP controller & state management
│   └── data.js                  # Master dataset & demo records
├── backend/
│   ├── server.js                # Express server entry point & database connection
│   ├── seed.js                  # Sample database seeder (safe demo data)
│   ├── package.json             # Backend dependencies & run scripts
│   ├── .env.example             # Environment variables template
│   ├── controllers/             # Request handlers (auth, users)
│   ├── middleware/              # Auth, role authorization, error handling
│   ├── models/                  # Mongoose schemas (User, Equipment, Transaction)
│   ├── routes/                  # Express API routers (/api/auth, /api/users)
│   └── utils/                   # Fine calculator & express-validator schemas
└── .gitignore                   # Excludes node_modules, secrets, and generated files
```

---

## Backend Setup & Configuration

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)

### 2. Install Dependencies
Navigate into the `backend` directory and install required npm packages:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file to create your local `.env`:

```bash
cp .env.example .env     # On Linux / macOS
copy .env.example .env   # On Windows (cmd)
```

Edit `backend/.env` with your local or production settings:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for the Express server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/college_management_system` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_secure_random_jwt_secret_key` |
| `JWT_EXPIRE` | Expiration duration for access tokens | `30d` |
| `FINE_PER_DAY` | Penalty fine in ₹ per day for overdue equipment | `10` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |

> **Security Note:** Never commit `backend/.env` or credentials to Git. It is excluded by `.gitignore`.

### 4. Database Seeding (Optional)
To populate sample students, administrator accounts, and equipment records:

```bash
# Seed initial sample data
npm run seed

# Or reset / purge all collections
node seed.js -d
```

### 5. Running the Backend Server

```bash
# Start the server
npm start

# Or start in development mode
npm run dev
```

The server will start on `http://localhost:5000`.

---

## API Endpoints Reference

### System & Health
- `GET /` — API service info & version
- `GET /health` or `GET /api/health` — Service health & database connectivity check

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Student/Admin login, returns JWT
- `GET /api/auth/me` — Get profile of authenticated user (*Bearer token required*)
- `PUT /api/auth/profile` — Update user profile details (*Bearer token required*)

### Users & Administration (`/api/users`)
- `GET /api/users` — Search and filter students (*Admin only*)
- `GET /api/users/:id` — Retrieve user details with transaction history (*Admin only*)
- `PUT /api/users/:id` — Update student profile (*Admin only*)
- `PATCH /api/users/:id/status` — Activate or deactivate student account (*Admin only*)

---

## Frontend Usage

Open `index.html` directly in any modern web browser or serve via any static web server (such as Live Server or `npx serve .`). The client-side dashboard currently uses local storage to maintain session state and offline demo functionality.
