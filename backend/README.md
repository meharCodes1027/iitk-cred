# CredTech Backend

FastAPI backend for the CredTech credit scoring system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

3. Access the API documentation at: http://localhost:8000/docs

## Endpoints

- `GET /` - API status
- `POST /refresh_all` - Refresh all issuer scores
- `GET /score_all` - Get all scores
- `GET /issuers` - Get all issuers with latest scores
- `GET /issuer/{issuer_id}/details` - Get issuer details
- `GET /compare/{issuer_id}` - Compare agency vs model rating
- `GET /health` - Health check

## Docker

Build and run with Docker:
```bash
docker build -t credtech-backend .
docker run -p 8000:8000 credtech-backend
```
