// Firebase configuration and initialization for Admin Panel
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Default configuration (fallback)
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAxuLaOvT0JNCCoHVCQE_Jqi1Q062rtqi4",
  authDomain: "stickersrhino-8a7f5.firebaseapp.com",
  projectId: "stickersrhino-8a7f5",
  storageBucket: "stickersrhino-8a7f5.firebasestorage.app",
  messagingSenderId: "575196464508",
  appId: "1:575196464508:web:be4bab5f575e3ee59050f9",
  measurementId: "G-D4YN48WVCM",
};

let firebaseConfig = defaultFirebaseConfig;

// Fetch Firebase config from backend
async function fetchFirebaseConfig() {
  try {
    const response = await fetch(
      `${
        process.env.VITE_APP_API_BASE_URL || "http://localhost:5055"
      }/api/setting/firebase/config`
    );
    if (response.ok) {
      const config = await response.json();
      if (config.enabled) {
        return {
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
          measurementId: config.measurementId,
        };
      }
    }
  } catch (error) {
    console.warn("Using default Firebase config:", error.message);
  }
  return null;
}

// Initialize Firebase
let app;
let auth;

const initializeFirebase = async () => {
  if (getApps().length === 0) {
    // Try to fetch config from backend
    const backendConfig = await fetchFirebaseConfig();
    if (backendConfig) {
      firebaseConfig = backendConfig;
      console.log("✅ Using Firebase config from backend");
    } else {
      console.log("✅ Using default Firebase config");
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }

  return { app, auth };
};

// Initialize immediately
initializeFirebase();

export { auth, initializeFirebase };
export default app;
