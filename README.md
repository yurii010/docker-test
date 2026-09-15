# Task Manager

A small full-stack Task Manager application built with React, Express and PostgreSQL.

The project is intentionally simple: it is a clean base application to practice containerization and deployment on your own.

## Features

- Get a list of tasks
- Create a task
- Edit a task (title, description)
- Mark a task as completed / not completed
- Delete a task
- Filter tasks by status: All / Active / Completed

## Tech Stack

| Layer    | Technologies                         |
| -------- | ------------------------------------ |
| Frontend | React, Vite, JavaScript, Axios       |
| Backend  | Node.js, Express 5, JavaScript, `pg` |
| Database | PostgreSQL                           |

## Project Structure

```
docker-task-manager/
├── README.md
├── .gitignore
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── tasks-api.js
│       └── components/
│           ├── TaskFilter.jsx
│           ├── TaskForm.jsx
│           ├── TaskItem.jsx
│           └── TaskList.jsx
└── server/
    ├── .env.example
    ├── package.json
    └── src/
        ├── server.js
        ├── app.js
        ├── controllers/
        │   ├── health-controller.js
        │   └── task-controller.js
        ├── db/
        │   ├── init.js
        │   ├── pool.js
        │   ├── schema.sql
        │   └── seed.sql
        ├── middleware/
        │   ├── error-handler.js
        │   ├── http-error.js
        │   └── not-found-handler.js
        ├── routes/
        │   ├── health-routes.js
        │   └── task-routes.js
        ├── services/
        │   └── task-service.js
        └── validators/
            └── task-validator.js
```

### Backend layers

- `routes/` — maps HTTP methods and URLs to controllers
- `controllers/` — reads the request, calls validation and services, sends the response
- `validators/` — checks and normalizes input data
- `services/` — SQL queries to PostgreSQL
- `db/` — connection pool, SQL schema, seed data and init script
- `middleware/` — 404 and error handling

## Prerequisites

- Node.js **20.12+** (the backend uses `node --watch` and `--env-file-if-exists`)
- npm
- PostgreSQL **14+** installed locally and running

Check versions:

```bash
node -v
npm -v
psql --version
```

## 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## 2. Create the PostgreSQL database

Create the database (use your own PostgreSQL user):

```bash
createdb -U postgres task_manager
```

or via `psql`:

```bash
psql -U postgres -c "CREATE DATABASE task_manager;"
```

Then create the table and seed data. There are two options.

**Option A — npm script** (uses variables from `server/.env`):

```bash
cd server
npm run db:init
```

**Option B — plain SQL files with `psql`:**

```bash
psql -U postgres -d task_manager -f server/src/db/schema.sql
psql -U postgres -d task_manager -f server/src/db/seed.sql
```

Both SQL files are safe to run multiple times: the table is created only if it does not exist, and seed data is inserted only into an empty table.

## 3. Environment variables

### Backend — `server/.env`

```bash
cd server
cp .env.example .env
```

| Variable      | Description                         | Example                 |
| ------------- | ----------------------------------- | ----------------------- |
| `PORT`        | Port for the Express server         | `5000`                  |
| `DB_HOST`     | PostgreSQL host                     | `localhost`             |
| `DB_PORT`     | PostgreSQL port                     | `5432`                  |
| `DB_NAME`     | Database name                       | `task_manager`          |
| `DB_USER`     | Database user                       | `postgres`              |
| `DB_PASSWORD` | Database password                   | `your_password_here`    |
| `CORS_ORIGIN` | Frontend URL allowed to call the API | `http://localhost:5173` |

The `dev` and `db:init` scripts load `server/.env` automatically. The `start` script does **not** load `.env` — it expects variables to be already set in the environment.

### Frontend — `client/.env`

```bash
cd client
cp .env.example .env
```

| Variable       | Description          | Example                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the API  | `http://localhost:5000/api` |

Vite injects `VITE_*` variables **at build time**, not at runtime.

## 4. Run the backend

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:5000/api`.

Check that the server is connected to the database:

```bash
curl http://localhost:5000/api/health
```

For a non-watch run: `npm start` (environment variables must be set in the shell).

## 5. Run the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

The build output goes to `client/dist/`.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint     | Description                               |
| ------ | ------------ | ----------------------------------------- |
| GET    | `/health`    | Server and database status                |
| GET    | `/tasks`     | List tasks (`?status=all/active/completed`) |
| GET    | `/tasks/:id` | Get one task                              |
| POST   | `/tasks`     | Create a task                             |
| PATCH  | `/tasks/:id` | Update a task (partial)                   |
| DELETE | `/tasks/:id` | Delete a task                             |

### Task object

```json
{
  "id": 1,
  "title": "Learn Docker basics",
  "description": "Images, containers, docker run, docker ps",
  "completed": false,
  "created_at": "2026-09-13T10:00:00.000Z"
}
```

### Validation rules

- `title` — required on create, non-empty string, max 255 characters
- `description` — optional, string or `null`, max 2000 characters
- `completed` — boolean (only on update)
- `PATCH` accepts only `title`, `description`, `completed`, and at least one of them
- `id` — positive integer

### Error format

```json
{ "error": "Title is required and must be a non-empty string" }
```

| Status | When                                     |
| ------ | ---------------------------------------- |
| 400    | Invalid input, invalid JSON, invalid id  |
| 404    | Task or route not found                  |
| 500    | Unexpected server / database error       |
| 503    | Health check: database is not available  |

## API Request Examples

Get all tasks:

```bash
curl http://localhost:5000/api/tasks
```

Get only active tasks:

```bash
curl "http://localhost:5000/api/tasks?status=active"
```

Get only completed tasks:

```bash
curl "http://localhost:5000/api/tasks?status=completed"
```

Get one task:

```bash
curl http://localhost:5000/api/tasks/1
```

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker volumes", "description": "Named volumes vs bind mounts"}'
```

Update title and description:

```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker basics (updated)", "description": null}'
```

Mark as completed:

```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

Validation error example:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```

```json
{ "error": "Title is required and must be a non-empty string" }
```
