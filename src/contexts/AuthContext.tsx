import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInAnonymously,
    updateProfile,
    User,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    displayName: string;
    points: number;
    createdAt: any;
}

type AppUser = {
    firebaseUser: User;
    profile: UserProfile | null;
};

interface AuthContextType {
    currentUser: AppUser | null;
    loading: boolean;
    signIn: () => Promise<User>;
    createUsername: (user: User, displayName: string) => Promise<void>;
    updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Separate states for Firebase user and our custom profile
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const signIn = async () => {
        try {
            const userCredential = await signInAnonymously(auth);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const updateUserProfile = async (newDisplayName: string) => {
        if (firebaseUser) {
            // Update profile in Firebase Auth
            await updateProfile(firebaseUser, { displayName: newDisplayName });

            // Update profile in Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            await setDoc(userDocRef, { displayName: newDisplayName }, { merge: true });

            // Update local state
            if (userProfile) {
                setUserProfile({ ...userProfile, displayName: newDisplayName });
            }
        } else {
            throw new Error("No user is signed in to update the profile.");
        }
    };

    const createUsername = async (user: User, displayName: string) => {
        const profile: UserProfile = {
            uid: user.uid,
            displayName,
            points: 10000,
            createdAt: serverTimestamp(),
        };
        // Set the profile in Firestore first
        await setDoc(doc(db, 'users', user.uid), profile);

        // Then update the auth profile
        await updateProfile(user, { displayName });

        // Finally, update the local state to ensure consistency
        setUserProfile(profile);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setFirebaseUser(user); // Store the original Firebase user object
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                } else {
                    setUserProfile(null);
                }
            } else {
                setFirebaseUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Combine the user and profile into a single object for consumers of the context
    const currentUser: AppUser | null = firebaseUser
        ? { firebaseUser, profile: userProfile }
        : null;

    const value: AuthContextType = {
        currentUser,
        loading,
        signIn,
        createUsername,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext }; 