// Mock API for development (replace with Firebase/Firestore in production)
const API_BASE_URL = 'http://localhost:8000';

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function getIssuersWithScores() {
  return await apiCall('/issuers');
}

export async function getIssuerDetails(issuerId) {
  return await apiCall(`/issuer/${issuerId}/details`);
}

export async function triggerRefresh() {
  return await apiCall('/refresh_all', { method: 'POST' });
}

export async function getScoreAll() {
  return await apiCall('/score_all');
}

export async function compareIssuer(issuerId) {
  return await apiCall(`/compare/${issuerId}`);
}

export async function healthCheck() {
  return await apiCall('/health');
}

// Firebase/Firestore integration (for production)
/*
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getIssuersWithScoresFirebase() {
  const issuersSnap = await getDocs(collection(db, "issuers"));
  const scoresSnap = await getDocs(collection(db, "scores"));
  
  const scoresMap = {};
  scoresSnap.forEach(doc => {
    const data = doc.data();
    scoresMap[data.issuer_id] = data;
  });
  
  return issuersSnap.docs.map(doc => {
    const issuer = { id: doc.id, ...doc.data() };
    return {
      ...issuer,
      ...scoresMap[issuer.id]
    };
  });
}

export async function getIssuerDetailsFirebase(issuerId) {
  const issuerDoc = await getDoc(doc(db, "issuers", issuerId));
  const scoresSnap = await getDocs(collection(db, "scores"));
  const eventsSnap = await getDocs(collection(db, "events"));
  
  const score = scoresSnap.docs.find(d => d.data().issuer_id === issuerId)?.data();
  const events = eventsSnap.docs
    .filter(d => d.data().issuer_id === issuerId)
    .map(d => d.data())
    .slice(0, 5);
  
  return {
    issuer: { id: issuerDoc.id, ...issuerDoc.data() },
    score,
    events
  };
}
*/
