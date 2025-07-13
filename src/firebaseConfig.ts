// webapp/src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import {
    getAnalytics,
    logEvent,
    setUserId,
    setUserProperties,
    Analytics
} from "firebase/analytics";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
});

// Initialize Analytics - only in browser environment (not during SSR)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Helper functions for analytics
const trackEvent = (eventName: string, eventParams: Record<string, any> = {}): void => {
    if (analytics) {
        logEvent(analytics, eventName, eventParams);
    }
};

const trackUserIdentity = (userId: string): void => {
    if (analytics) {
        setUserId(analytics, userId);
    }
};

const trackUserProperties = (properties: Record<string, any>): void => {
    if (analytics) {
        setUserProperties(analytics, properties);
    }
};

export { app, auth, db, analytics, trackEvent, trackUserIdentity, trackUserProperties }; 