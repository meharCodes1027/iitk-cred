from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
from datetime import datetime
import random
import uuid

import shap
import numpy as np
from sklearn.linear_model import LogisticRegression

app = FastAPI(title="CredTech API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database (in production, use Firestore)
mock_db = {
    "issuers": {},
    "scores": {},
    "events": {}
}

# --- Models ---
class Issuer(BaseModel):
    id: str
    name: str
    sector: str
    baseline_rating: str

class Score(BaseModel):
    issuer_id: str
    score: int
    shap_values: List[str]
    outlook: str
    timestamp: str

class Event(BaseModel):
    issuer_id: str
    event_type: str
    description: str
    applied_on: str

# --- Mock Data Generation ---
SECTORS = ["Finance", "Tech", "Retail", "Energy", "Healthcare"]
BASELINE_RATINGS = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-"]
COMPANY_NAMES = [
    "TechCorp Industries", "Global Finance Ltd", "Retail Giants Inc", "Energy Solutions Co",
    "Healthcare Innovations", "Digital Dynamics", "Investment Holdings", "Consumer Products LLC",
    "Manufacturing Systems", "Data Analytics Corp"
]

def initialize_mock_data():
    """Initialize mock data for demo purposes"""
    if not mock_db["issuers"]:
        for i in range(10):
            issuer_id = str(uuid.uuid4())
            issuer = {
                "id": issuer_id,
                "name": COMPANY_NAMES[i],
                "sector": random.choice(SECTORS),
                "baseline_rating": random.choice(BASELINE_RATINGS)
            }
            mock_db["issuers"][issuer_id] = issuer
            
            # Generate initial score for each issuer
            features = mock_financials()
            news = mock_news()
            
            # Calculate base score from financials
            base_score = int(50 + features["profit_margin"]*50 - features["debt_ratio"]*30 + features["growth"]*40)
            
            # Apply news-based rules
            final_score = apply_rules(base_score, news)
            
            # Generate SHAP explanations
            shap_factors = run_model(features)
            
            # Determine outlook
            outlook = get_outlook(final_score)
            
            # Create timestamp
            timestamp = datetime.utcnow().isoformat()
            
            # Store initial score
            score_id = str(uuid.uuid4())
            mock_db["scores"][score_id] = {
                "id": score_id,
                "issuer_id": issuer_id,
                "score": final_score,
                "shap_values": shap_factors,
                "outlook": outlook,
                "timestamp": timestamp
            }
            
            # Store initial event
            event_id = str(uuid.uuid4())
            mock_db["events"][event_id] = {
                "id": event_id,
                "issuer_id": issuer_id,
                "event_type": "news",
                "description": f"Initial assessment: {', '.join(news)}",
                "applied_on": timestamp
            }

def mock_financials():
    return {
        "profit_margin": random.uniform(-0.2, 0.4),
        "debt_ratio": random.uniform(0.1, 1.0),
        "growth": random.uniform(-0.1, 0.3),
    }

def mock_news():
    keywords = ["profit", "expansion", "fraud", "merger", "loss", "innovation", "bankruptcy", "acquisition"]
    return random.sample(keywords, k=random.randint(1, 3))

def get_issuers():
    return list(mock_db["issuers"].values())

def get_events(issuer_id):
    events = [event for event in mock_db["events"].values() if event["issuer_id"] == issuer_id]
    return sorted(events, key=lambda x: x["applied_on"], reverse=True)[:5]

# --- ML & SHAP ---
def run_model(features):
    """Run ML model and generate SHAP explanations"""
    try:
        X = np.array([[features["profit_margin"], features["debt_ratio"], features["growth"]]])
        y = np.array([1])  # Dummy target for training
        
        # Create and train model
        model = LogisticRegression(random_state=42)
        
        # Generate some training data for the model
        X_train = np.random.rand(100, 3)
        y_train = np.random.randint(0, 2, 100)
        model.fit(X_train, y_train)
        
        # Generate SHAP values
        explainer = shap.Explainer(model, X_train)
        shap_values = explainer(X)
        
        feature_names = ["profit_margin", "debt_ratio", "growth"]
        feature_impacts = []
        
        for i, name in enumerate(feature_names):
            impact = shap_values.values[0][i]
            feature_impacts.append((name, impact))
        
        # Sort by absolute impact and get top 3
        top_factors = sorted(feature_impacts, key=lambda x: abs(x[1]), reverse=True)[:3]
        return [f"{name.replace('_', ' ').title()}: {round(val, 3)}" for name, val in top_factors]
    
    except Exception as e:
        # Fallback if SHAP fails
        return [
            f"Profit Margin: {round(features['profit_margin'], 3)}",
            f"Debt Ratio: {round(features['debt_ratio'], 3)}",
            f"Growth Rate: {round(features['growth'], 3)}"
        ]

def apply_rules(score, news):
    """Apply business rules based on news sentiment"""
    for keyword in news:
        if keyword.lower() in ["fraud", "bankruptcy", "loss"]:
            score -= 20
        elif keyword.lower() in ["profit", "innovation", "expansion"]:
            score += 10
        elif keyword.lower() in ["merger", "acquisition"]:
            score += 5
    
    return max(0, min(100, score))

def get_outlook(score):
    """Determine outlook based on score"""
    if score >= 70:
        return "Safe"
    elif score >= 40:
        return "Caution"
    else:
        return "Risk"

# --- Endpoints ---
@app.on_event("startup")
async def startup_event():
    """Initialize mock data on startup"""
    initialize_mock_data()

@app.get("/")
def read_root():
    return {"message": "CredTech API is running!", "version": "1.0.0"}

@app.post("/refresh_all")
def refresh_all():
    """Refresh all issuer scores and generate new events"""
    issuers = get_issuers()
    updated_count = 0
    
    for issuer in issuers:
        try:
            # Generate mock financial data
            features = mock_financials()
            news = mock_news()
            
            # Calculate base score from financials
            base_score = int(50 + features["profit_margin"]*50 - features["debt_ratio"]*30 + features["growth"]*40)
            
            # Apply news-based rules
            final_score = apply_rules(base_score, news)
            
            # Generate SHAP explanations
            shap_factors = run_model(features)
            
            # Determine outlook
            outlook = get_outlook(final_score)
            
            # Create timestamp
            timestamp = datetime.utcnow().isoformat()
            
            # Store score
            score_id = str(uuid.uuid4())
            mock_db["scores"][score_id] = {
                "id": score_id,
                "issuer_id": issuer["id"],
                "score": final_score,
                "shap_values": shap_factors,
                "outlook": outlook,
                "timestamp": timestamp
            }
            
            # Store event
            event_id = str(uuid.uuid4())
            mock_db["events"][event_id] = {
                "id": event_id,
                "issuer_id": issuer["id"],
                "event_type": "news",
                "description": f"Market analysis: {', '.join(news)}",
                "applied_on": timestamp
            }
            
            updated_count += 1
            
        except Exception as e:
            print(f"Error processing issuer {issuer['id']}: {str(e)}")
            continue
    
    return {"status": "success", "updated_issuers": updated_count}

@app.get("/score_all")
def score_all():
    """Get all current scores"""
    return list(mock_db["scores"].values())

@app.get("/issuers")
def get_all_issuers():
    """Get all issuers with their latest scores"""
    issuers = get_issuers()
    result = []
    
    for issuer in issuers:
        # Get latest score for this issuer
        issuer_scores = [score for score in mock_db["scores"].values() 
                        if score["issuer_id"] == issuer["id"]]
        latest_score = max(issuer_scores, key=lambda x: x["timestamp"]) if issuer_scores else None
        
        issuer_data = issuer.copy()
        if latest_score:
            issuer_data.update({
                "score": latest_score["score"],
                "outlook": latest_score["outlook"],
                "timestamp": latest_score["timestamp"]
            })
        else:
            issuer_data.update({
                "score": None,
                "outlook": "Unknown",
                "timestamp": None
            })
        
        result.append(issuer_data)
    
    return result

@app.get("/compare/{issuer_id}")
def compare(issuer_id: str):
    """Compare agency rating vs model score for an issuer"""
    if issuer_id not in mock_db["issuers"]:
        raise HTTPException(status_code=404, detail="Issuer not found")
    
    issuer = mock_db["issuers"][issuer_id]
    
    # Get latest score
    issuer_scores = [score for score in mock_db["scores"].values() 
                    if score["issuer_id"] == issuer_id]
    latest_score = max(issuer_scores, key=lambda x: x["timestamp"]) if issuer_scores else None
    
    if not latest_score:
        raise HTTPException(status_code=404, detail="No score found for this issuer")
    
    return {
        "issuer_id": issuer_id,
        "issuer_name": issuer["name"],
        "baseline_rating": issuer["baseline_rating"],
        "model_score": latest_score["score"],
        "outlook": latest_score["outlook"]
    }

@app.get("/issuer/{issuer_id}/details")
def issuer_details(issuer_id: str):
    """Get detailed information for a specific issuer"""
    if issuer_id not in mock_db["issuers"]:
        raise HTTPException(status_code=404, detail="Issuer not found")
    
    issuer = mock_db["issuers"][issuer_id]
    
    # Get latest score
    issuer_scores = [score for score in mock_db["scores"].values() 
                    if score["issuer_id"] == issuer_id]
    latest_score = max(issuer_scores, key=lambda x: x["timestamp"]) if issuer_scores else None
    
    # Get events
    events = get_events(issuer_id)
    
    return {
        "issuer": issuer,
        "score": latest_score,
        "events": events
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "issuers_count": len(mock_db["issuers"]),
        "scores_count": len(mock_db["scores"]),
        "events_count": len(mock_db["events"])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
