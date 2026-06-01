import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";

const firebaseConfig = {
  projectId: "monroo",
  appId: "1:912990195363:web:e414cc714abcb11e557916",
  apiKey: "AIzaSyCvOTMvpbpgbVXRisvWCKphedQ1-_rpX4k",
  authDomain: "monroo.firebaseapp.com",
  storageBucket: "monroo.firebasestorage.app",
  messagingSenderId: "912990195363"
};

const FIRESTORE_DB_ID = "ai-studio-387569e7-577b-48bc-84eb-4594770c93a3";

function getDB() {
  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return getFirestore(app, FIRESTORE_DB_ID);
}

export async function fsGetCollection(collectionName: string): Promise<any[]> {
  try {
    const db = getDB();
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.error(`[Firebase] Error fetching ${collectionName}:`, err);
    return [];
  }
}

export async function fsGetSettings(): Promise<any> {
  try {
    const db = getDB();
    const snap = await getDoc(doc(db, "settings", "main"));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("[Firebase] Error fetching settings:", err);
    return null;
  }
}

export async function fsSaveDoc(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    const db = getDB();
    const sanitized = sanitize(data);
    await setDoc(doc(db, collectionName, docId), sanitized);
  } catch (err) {
    console.error(`[Firebase] Error saving ${collectionName}/${docId}:`, err);
    throw err;
  }
}

export async function fsSaveSettings(data: any): Promise<void> {
  try {
    const db = getDB();
    await setDoc(doc(db, "settings", "main"), sanitize(data));
  } catch (err) {
    console.error("[Firebase] Error saving settings:", err);
    throw err;
  }
}

export async function fsDeleteDoc(collectionName: string, docId: string): Promise<void> {
  try {
    const db = getDB();
    await deleteDoc(doc(db, collectionName, docId));
  } catch (err) {
    console.error(`[Firebase] Error deleting ${collectionName}/${docId}:`, err);
  }
}

function sanitize(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj === "object") {
    const clean: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) clean[key] = sanitize(obj[key]);
    }
    return clean;
  }
  return obj;
}
