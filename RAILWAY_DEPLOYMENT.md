# Railway Deployment Checklist

This project is a monorepo with two deployable services:

- Backend root directory: `/backend`
- Frontend root directory: `/frontend`

Commit and push both folders before deploying:

```bash
git add backend frontend package.json package-lock.json README.md RAILWAY_DEPLOYMENT.md
git commit -m "Prepare Railway deployment"
git push origin main
```

## 1. Create Railway Project

1. Open Railway.
2. Create a new project from your GitHub repository.
3. Add two services from the same repo:
   - `team-task-manager-backend`
   - `team-task-manager-frontend`

## 2. Backend Service

Set root directory:

```text
/backend
```

Railway will use `backend/railway.json`.

Backend variables:

```env
NODE_ENV=production
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
USE_MEMORY_DB=false
FRONTEND_URL=https://your-frontend-domain.up.railway.app
```

Add a PostgreSQL service in the same Railway project, then set either `DATABASE_URL`:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Or set individual variables:

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
```

Generate a public domain for the backend. The backend health check should work at:

```text
https://your-backend-domain.up.railway.app/api/health
```

## 3. Frontend Service

Set root directory:

```text
/frontend
```

Railway will use `frontend/railway.json`.

Frontend variable:

```env
REACT_APP_API_URL=https://your-backend-domain.up.railway.app/api
```

Redeploy the frontend after setting this variable because Create React App reads it at build time.

## 4. Final CORS Update

After the frontend domain is generated, update the backend variable:

```env
FRONTEND_URL=https://your-frontend-domain.up.railway.app
```

Redeploy the backend.

## Common Error

If Railway says it cannot find `backend/` or `frontend/`, those folders were not pushed to GitHub. Confirm on GitHub that both folders are visible in the `main` branch.
