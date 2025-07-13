import {
    collection,
    query,
    orderBy,
    getDocs,
    CollectionReference,
    DocumentData
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserProfile } from '../contexts/AuthContext';

const usersCollection = collection(db, 'users') as CollectionReference<DocumentData>;

/**
 * Fetches all user profiles from Firestore, ordered by points in descending order.
 * @returns An array of user profiles.
 */
export const getAllUsers = async (): Promise<UserProfile[]> => {
    const q = query(usersCollection, orderBy('points', 'desc'));

    try {
        const querySnapshot = await getDocs(q);
        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data() as UserProfile);
        });
        return users;
    } catch (error) {
        console.error("Error fetching all users: ", error);
        return [];
    }
};
