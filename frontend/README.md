# CredTech Frontend

React dashboard for the CredTech credit scoring system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## Features

- **Issuer Table**: View all issuers with their credit scores and ratings
- **Detailed View**: Click on any issuer to see detailed information including:
  - Current credit score with color coding
  - Baseline agency rating
  - Top 3 SHAP explanation factors
  - Event history
- **Real-time Updates**: Trigger refresh to re-run scoring
- **Responsive Design**: Works on desktop and mobile devices

## Build for Production

```bash
npm run build
```

## Firebase Hosting (Production)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init hosting
```

3. Deploy:
```bash
npm run build
firebase deploy
```
