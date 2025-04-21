import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    User,
    UserCredential
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { Box, CircularProgress } from '@mui/material';

type ExtendedUser = User; // Use basic User type

// Define the shape of our auth context
interface AuthContextType {
    currentUser: ExtendedUser | null;
    loading: boolean;
    signup: (email: string, password: string, displayName?: string) => Promise<UserCredential>; // Simplified signup signature
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserProfile: (displayName: string) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            if (userCredential.user) {
                // Update Firebase Auth profile
                await updateProfile(userCredential.user, { displayName });

                // Create user document in Firestore
                const userData = {
                    uid: userId,
                    email,
                    displayName,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };
                await setDoc(doc(db, 'users', userId), userData);
            }

            return userCredential; // Return the user credential
        } catch (error) {
            console.error('[AuthContext] signup: Error during signup:', error);
            throw error;
        }
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email: string) => {
        return sendPasswordResetEmail(auth, email);
    };

    const updateUserProfile = async (displayName: string) => {
        if (currentUser) {
            await updateProfile(currentUser, { displayName });
            // Optionally update Firestore user document as well if needed
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { displayName, updatedAt: serverTimestamp() });
            // Refresh currentUser state if Firestore data is the source of truth
            const updatedUser = { ...currentUser, displayName };
            setCurrentUser(updatedUser);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {

                setCurrentUser(user);

            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Value to be provided by the context
    const value: AuthContextType = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : children}
        </AuthContext.Provider>
    );
};

// Export the context
export { AuthContext }; 