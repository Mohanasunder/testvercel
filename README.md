# Consenz

Project management application for project managers.

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL running on `localhost:5432`

## Setup

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and adjust credentials:

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Create database tables:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` (frontend) and `http://localhost:8000` (backend API).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh tokens |
| GET | `/api/v1/auth/me` | Get current user |
| GET | `/api/v1/projects` | List projects |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/{id}` | Get project details |
| PUT | `/api/v1/projects/{id}` | Update project |
| DELETE | `/api/v1/projects/{id}` | Delete project |
| GET | `/api/v1/projects/{id}/team-members` | List team members |
| POST | `/api/v1/projects/{id}/team-members` | Add team member |
| PUT | `/api/v1/projects/{id}/team-members/{mid}` | Update team member |
| DELETE | `/api/v1/projects/{id}/team-members/{mid}` | Remove team member |
| GET | `/api/v1/projects/{id}/milestones` | List milestones |
| POST | `/api/v1/projects/{id}/milestones` | Add milestone |
| PUT | `/api/v1/projects/{id}/milestones/{mid}` | Update milestone |
| DELETE | `/api/v1/projects/{id}/milestones/{mid}` | Remove milestone |
