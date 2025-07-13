import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    where,
    Timestamp,
    CollectionReference,
    DocumentData,
    updateDoc,
    doc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Notification {
    id: string;
    userId: string; // The user who should receive the notification
    message: string;
    wagerId: string;
    isRead: boolean;
    createdAt: Timestamp;
}

const notificationsCollection = collection(db, 'notifications') as CollectionReference<DocumentData>;

/**
 * Creates a new notification document in Firestore.
 * @param userId - The ID of the user to notify.
 * @param wagerId - The ID of the related wager.
 * @param message - The notification message.
 */
export const createNotification = async (userId: string, wagerId: string, message: string): Promise<void> => {
    try {
        await addDoc(notificationsCollection, {
            userId,
            wagerId,
            message,
            isRead: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating notification: ", error);
        // Fail silently so it doesn't interrupt user flow
    }
};

/**
 * Marks a specific notification as read.
 * @param notificationId - The ID of the notification to update.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const notificationRef = doc(db, 'notifications', notificationId);
    try {
        await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
        console.error("Error marking notification as read: ", error);
    }
};


/**
 * Sets up a real-time listener for a user's notifications.
 * @param userId - The ID of the user whose notifications to fetch.
 * @param callback - A function to be called with the updated array of notifications.
 * @returns An unsubscribe function to clean up the listener.
 */
export const onNotificationsUpdate = (
    userId: string,
    callback: (notifications: Notification[]) => void
) => {
    const q = query(
        notificationsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifications: Notification[] = [];
        querySnapshot.forEach((doc) => {
            notifications.push({
                id: doc.id,
                ...doc.data(),
            } as Notification);
        });
        callback(notifications);
    }, (error) => {
        console.error("Error fetching notifications: ", error);
    });

    return unsubscribe;
}; 