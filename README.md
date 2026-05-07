# Team Task Manager

Full-stack team task manager with a React frontend, Express backend, JWT authentication, and PostgreSQL storage.

## What Is Included

- `frontend/` - React application
- `backend/` - Express API server
- `backend/.env.example` - backend environment template
- `frontend/.env.example` - frontend environment template
- `docker-compose.yml` - optional local PostgreSQL setup
- `package-lock.json`, `backend/package-lock.json`, and `frontend/package-lock.json` - reproducible npm installs

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL running locally, or Docker for the included PostgreSQL container

## Setup

Install root tools:

```powershell
npm install
```

Install backend dependencies:

```powershell
cd backend
npm install
```

Install frontend dependencies:

```powershell
cd ..\frontend
npm install
```

## Database

Option 1: Use an existing PostgreSQL install.

Create a database named `team_task_manager`, then copy `backend/.env.example` to `backend/.env` and update the password if needed.

Option 2: Use Docker.

```powershell
docker compose up -d postgres
```

The Docker database matches the default backend settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=team_task_manager
```

## Run Locally

Start the backend:

```powershell
cd backend
npm run dev
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm start
```

Open `http://localhost:3000`.

## Useful Scripts

From the root folder:

```powershell
npm run install-all
npm run dev
npm run build
```

## Health Check

When the backend is running, visit:

```text
http://localhost:5000/api/health
```
