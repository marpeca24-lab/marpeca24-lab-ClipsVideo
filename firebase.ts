import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, onSnapshot, addDoc, updateDoc, serverTimestamp, Timestamp, getDocFromServer, orderBy, limit, increment } from 'firebase/firestore';

// Default empty config
const defaultConfig = {
  apiKey: "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

let firebaseConfig = defaultConfig;

try {
  // Try to load the real config
  // @ts-ignore
  const config = require('./firebase-applet-config.json');
  if (config && config.apiKey && config.apiKey !== "TODO_KEYHERE") {
    firebaseConfig = config;
  }
} catch (e) {
  // Config not found or invalid
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

// Test connection to Firestore
async function testConnection() {
  if (firebaseConfig.apiKey === "placeholder") return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  orderBy,
  limit,
  increment
};
export type { FirebaseUser };
