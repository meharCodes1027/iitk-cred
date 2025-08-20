# CredTech - AI-Powered Credit Risk Assessment Platform

A complete end-to-end fintech application for credit scoring and risk assessment using AI/ML and real-time data.

## 🏗️ Architecture

- **Frontend**: React dashboard with Material-UI, hosted on Firebase
- **Backend**: FastAPI with ML models (Logistic Regression + SHAP explanations)
- **Database**: Firestore (with mock data for development)
- **ML/AI**: SHAP for explainable AI, sklearn for modeling

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will be available at: http://localhost:3000

## 📊 Features

### Dashboard
- View all issuers with credit scores, ratings, and outlooks
- Color-coded risk assessment (Green=Safe, Yellow=Caution, Red=Risk)
- Real-time data updates
- Responsive design

### Detailed Issuer View
- Current credit score (0-100) with visual indicators
- Baseline agency rating comparison
- Top 3 SHAP explanation factors for transparency
- Event history showing recent market impacts

### AI/ML Engine
- Logistic Regression model for credit scoring
- SHAP values for explainable AI
- Business rules for news sentiment analysis
- Real-time score updates

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| POST | `/refresh_all` | Refresh all issuer scores |
| GET | `/issuers` | Get all issuers with latest scores |
| GET | `/issuer/{id}/details` | Get detailed issuer information |
| GET | `/compare/{id}` | Compare agency vs model rating |
| GET | `/health` | Health check |

## 📁 Project Structure

```
cred/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   └── README.md              # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── api.js             # API integration
│   │   ├── IssuerTable.js     # Issuers table component
│   │   ├── IssuerDetail.js    # Detailed view component
│   │   └── index.js           # React entry point
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Node.js dependencies
│   └── README.md              # Frontend documentation
└── README.md                  # This file
```

## 🎯 Demo Flow

1. **Load Dashboard**: View all issuers with their current scores
2. **Click Issuer**: See detailed breakdown with SHAP factors and event history
3. **Trigger Refresh**: Re-run ML model to update all scores
4. **Real-time Updates**: Frontend automatically refreshes with new data

## 🧪 Sample Data

The system generates mock data including:
- 10 sample companies across different sectors
- Financial indicators (profit margin, debt ratio, growth)
- News events with sentiment analysis
- Agency ratings (AAA to BB-)

## 🚀 Production Deployment

### Backend (Cloud Run)
```bash
cd backend
docker build -t credtech-backend .
# Deploy to Google Cloud Run
```

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy
```

### Database (Firestore)
Replace mock data with Firestore integration in production.

## 🔮 Future Enhancements

- **Enhanced ML Models**: XGBoost, Neural Networks
- **Real-time Data**: Live financial feeds, news APIs
- **Advanced Analytics**: Portfolio risk assessment, scenario modeling
- **User Authentication**: Role-based access control
- **Alerting System**: Risk threshold notifications
- **API Rate Limiting**: Production-ready API security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

**Built for Fintech Hackathons** 🏆
