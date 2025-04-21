import {
    collection,
    getDocs,
    query,
    where,
    doc,
    Timestamp,
    orderBy,
    limit,
    updateDoc,
    DocumentData,
    onSnapshot,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Corrected path to firebase config

// Define the FirestoreNotification interface
export interface FirestoreNotification {
    id: string;
    message: string;
    type: 'alert_found' | 'alert_error' | 'info' | string; // Add specific types
    data?: {
        // Add relevant data, e.g., alertId, permitAreaId, etc.
        alertId?: string;
        permitAreaId?: string;
    };
    read: boolean;
    createdAt?: Date | null;
    userId: string;
}

const getNotificationPath = (userId: string) => `users/${userId}/notifications`;

/**
 * Fetches notifications for a specific user, with optional limit.
 * @param userId - The user's ID
 * @param limitCount - Maximum number of notifications to fetch
 * @returns Promise<Array> Array of notification objects
 */
export const getNotifications = async (userId: string, limitCount = 10): Promise<FirestoreNotification[]> => {
    if (!userId) {
        console.error('[notificationService] No user ID provided');
        return [];
    }

    try {
        const notificationsQuery = query(
            collection(db, getNotificationPath(userId)), // Use user-specific path
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(notificationsQuery);

        return snapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            return {
                id: doc.id,
                message: data.message || '',
                type: data.type || 'info',
                data: data.data || {}, // Keep flexible data field
                read: data.read ?? false,
                userId: data.userId || userId,
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
            } as FirestoreNotification;
        });
    } catch (error) {
        console.error('[notificationService] Error fetching notifications:', error);
        throw error;
    }
};

/**
 * Sets up a real-time listener for notifications for a specific user.
 * @param userId - The user ID
 * @param limitCount - Maximum number of notifications to fetch
 * @param callback - Function to call with updated notifications
 * @returns Unsubscribe function
 */
export const subscribeToNotifications = (
    userId: string,
    limitCount = 10,
    callback: (notifications: FirestoreNotification[]) => void
): (() => void) => {
    if (!userId) {
        console.error('[notificationService] Missing userId for subscription');
        callback([]);
        return () => { }; // Return a no-op unsubscribe function
    }

    const notificationsQuery = query(
        collection(db, getNotificationPath(userId)), // Use user-specific path
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const unsubscribe = onSnapshot(
        notificationsQuery,
        (snapshot) => {
            const notificationList = snapshot.docs.map(doc => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    message: data.message || '',
                    type: data.type || 'info',
                    data: data.data || {},
                    read: data.read ?? false,
                    userId: data.userId || userId,
                    createdAt: data.createdAt ? data.createdAt.toDate() : null,
                } as FirestoreNotification;
            });
            callback(notificationList);
        },
        (error) => {
            console.error('[notificationService] Error listening to notifications:', error);
            // Optionally handle error state in the component via callback
            // callback([], error); // Example: pass error back
        }
    );

    return unsubscribe;
};

/**
 * Marks a specific notification as read in Firestore.
 * @param userId - The user ID owning the notification
 * @param notificationId - ID of the notification to update
 * @returns Promise<void>
 */
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
    if (!userId) {
        console.error('[notificationService] No user ID provided to mark read');
        return;
    }
    if (!notificationId) {
        console.error('[notificationService] No notification ID provided to mark read');
        return;
    }

    try {
        const notificationRef = doc(db, getNotificationPath(userId), notificationId);
        await updateDoc(notificationRef, {
            read: true,
            updatedAt: Timestamp.now() // Use Firestore timestamp
        });
        console.log(`[notificationService] Notification ${notificationId} marked as read for user ${userId}`);
    } catch (error) {
        console.error('[notificationService] Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Marks all unread notifications as read for a user using a batch write.
 * @param userId - The user ID
 * @returns Promise<number> - Number of notifications marked as read
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<number> => {
    if (!userId) {
        console.error('[notificationService] No user ID provided to mark all read');
        return 0;
    }

    try {
        const unreadQuery = query(
            collection(db, getNotificationPath(userId)), // Use user-specific path
            where('read', '==', false)
        );

        const snapshot = await getDocs(unreadQuery);
        if (snapshot.empty) {
            console.log('[notificationService] No unread notifications found for user', userId);
            return 0;
        }

        const batch = writeBatch(db);
        const now = Timestamp.now(); // Use Firestore timestamp

        snapshot.docs.forEach(docSnapshot => {
            // Construct the full path again for the batch update
            const notificationRef = doc(db, getNotificationPath(userId), docSnapshot.id);
            batch.update(notificationRef, {
                read: true,
                updatedAt: now
            });
        });

        await batch.commit();
        console.log(`[notificationService] Marked ${snapshot.size} notifications as read for user ${userId}`);
        return snapshot.size;

    } catch (error) {
        console.error('[notificationService] Error marking all notifications as read:', error);
        throw error;
    }
}; 