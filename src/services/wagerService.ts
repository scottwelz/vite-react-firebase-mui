import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    CollectionReference,
    DocumentData,
    doc,
    runTransaction,
    Timestamp,
    deleteDoc,
    getDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { createNotification } from './notificationService';

// Define the structure of a single option in a wager
export interface WagerOption {
    text: string;
    odds: number;
}

// Define the detailed structure of a Wager document
export interface Wager {
    id: string; // The document ID from Firestore
    title: string;
    options: WagerOption[];
    author: string;
    authorId: string;
    createdAt: Timestamp;
    cutoffDate: Timestamp;
    status: 'open' | 'settled' | 'cancelled';
    winningOption?: string; // The winning option, only present if status is 'settled'
    bets: { userId: string; username: string; option: string; amount: number, createdAt: any }[];
    cancelledAt: Timestamp | null;
}

// Define the structure for creating a new wager (omits id and server-generated fields)
export type NewWager = Omit<Wager, 'id' | 'createdAt' | 'status' | 'bets' | 'winningOption' | 'cancelledAt'>;

const wagersCollection = collection(db, 'wagers') as CollectionReference<DocumentData>;

/**
 * Creates a new wager document in Firestore.
 * @param wagerData - The data for the new wager.
 */
export const createWager = async (wagerData: NewWager): Promise<string> => {
    try {
        const docRef = await addDoc(wagersCollection, {
            ...wagerData,
            status: 'open',
            bets: [],
            createdAt: serverTimestamp(),
            cancelledAt: null,
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating wager: ", error);
        throw new Error("Could not create wager.");
    }
};

/**
 * Cancels a wager, refunds all bets, and notifies bettors.
 * @param wagerId The ID of the wager to cancel.
 */
export const cancelWager = async (wagerId: string): Promise<void> => {
    const wagerRef = doc(db, 'wagers', wagerId);

    try {
        await runTransaction(db, async (transaction) => {
            const wagerDoc = await transaction.get(wagerRef);
            if (!wagerDoc.exists()) {
                throw new Error("Wager not found.");
            }

            const wagerData = wagerDoc.data() as Wager;

            if (wagerData.status !== 'open') {
                throw new Error("Only open wagers can be cancelled.");
            }

            // Refund points to all bettors
            for (const bet of wagerData.bets) {
                const userRef = doc(db, 'users', bet.userId);
                const userDoc = await transaction.get(userRef);
                if (userDoc.exists()) {
                    const newPoints = (userDoc.data()?.points || 0) + bet.amount;
                    transaction.update(userRef, { points: newPoints });
                }
            }

            // Update wager status
            transaction.update(wagerRef, {
                status: 'cancelled',
                cancelledAt: serverTimestamp() // Add a timestamp for cancellation
            });

            // This part is not transactional, but it's acceptable for notifications.
            // Notifications will be sent after the transaction succeeds.
        });

        // Send notifications to bettors outside of the transaction
        const wagerDoc = await getDoc(wagerRef);
        if (wagerDoc.exists()) {
            const wagerData = wagerDoc.data() as Wager;
            for (const bet of wagerData.bets) {
                const message = `The wager "${wagerData.title}" has been cancelled. Your bet of ${bet.amount} points has been refunded.`;
                createNotification(bet.userId, wagerId, message);
            }
        }

    } catch (error) {
        console.error("Error cancelling wager: ", error);
        throw new Error("Could not cancel wager.");
    }
};


/**
 * Deletes a wager document from Firestore.
 * @param wagerId The ID of the wager to delete.
 */
export const deleteWager = async (wagerId: string): Promise<void> => {
    const wagerRef = doc(db, 'wagers', wagerId);
    try {
        await deleteDoc(wagerRef);
    } catch (error) {
        console.error("Error deleting wager: ", error);
        throw new Error("Could not delete wager.");
    }
};

/**
 * Places a bet on a specific wager for a user.
 * Uses a transaction to ensure data integrity.
 * @param wagerId The ID of the wager to bet on.
 * @param userId The ID of the user placing the bet.
 * @param username The display name of the user.
 * @param option The option the user is betting on.
 * @param amount The number of points to bet.
 */
export const placeBet = async (
    wagerId: string,
    userId: string,
    username: string,
    option: string,
    amount: number
): Promise<void> => {
    const wagerRef = doc(db, 'wagers', wagerId);
    const userRef = doc(db, 'users', userId);


    try {
        await runTransaction(db, async (transaction) => {
            const wagerDoc = await transaction.get(wagerRef);
            const userDoc = await transaction.get(userRef);

            if (!wagerDoc.exists()) {
                throw new Error("Wager does not exist!");
            }
            if (!userDoc.exists()) {
                throw new Error("User profile not found.");
            }

            const wagerData = wagerDoc.data() as Wager;
            const userData = userDoc.data();
            const selectedOption = wagerData.options.find(opt => opt.text === option);

            if (!selectedOption) {
                throw new Error("Selected option not found on the wager.");
            }

            if (userData.points < amount) {
                throw new Error(`You don't have enough points to bet. You need ${amount} points.`);
            }

            // Prevent betting after the cutoff time
            if (wagerData.cutoffDate && wagerData.cutoffDate.toDate() < new Date()) {
                throw new Error("The betting period for this wager has ended.");
            }

            // Check if user has already placed a bet
            const existingBet = wagerData.bets.find(bet => bet.userId === userId);
            if (existingBet) {
                throw new Error("You have already placed a bet on this wager.");
            }

            // Deduct points from user
            const newPoints = userData.points - amount;
            transaction.update(userRef, { points: newPoints });

            const newBet = {
                userId,
                username,
                option,
                amount: amount,
                createdAt: new Date(), // Use client-side timestamp
            };

            const newBetsArray = [...wagerData.bets, newBet];
            transaction.update(wagerRef, { bets: newBetsArray });

            // Create a notification for the wager author
            const message = `${username} placed a bet on your wager: "${wagerData.title}"`;
            // We can't await this inside the transaction, so we just fire it.
            createNotification(wagerData.authorId, wagerId, message);
        });
    } catch (error) {
        console.error("Error placing bet: ", error);
        // Re-throw the error so the component layer can handle it
        throw error;
    }
};

/**
 * Settles a wager by updating its status and setting the winning option.
 * @param wagerId The ID of the wager to settle.
 * @param winningOption The option that was chosen as the winner.
 */
export const settleWager = async (wagerId: string, winningOption: string): Promise<void> => {
    const wagerRef = doc(db, 'wagers', wagerId);

    try {
        await runTransaction(db, async (transaction) => {
            const wagerDoc = await transaction.get(wagerRef);

            if (!wagerDoc.exists()) {
                throw new Error("Wager not found.");
            }

            const wagerData = wagerDoc.data() as Wager;

            if (wagerData.status === 'settled') {
                throw new Error("This wager has already been settled.");
            }

            const winners = wagerData.bets.filter(bet => bet.option === winningOption);
            const winningOptionDetails = wagerData.options.find(opt => opt.text === winningOption);

            if (!winningOptionDetails) {
                throw new Error("Winning option not found in wager details.");
            }

            const odds = winningOptionDetails.odds;

            for (const winner of winners) {
                const userRef = doc(db, 'users', winner.userId);
                const userDoc = await transaction.get(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const betAmount = winner.amount;
                    let winnings = 0;

                    if (odds > 0) {
                        // Positive odds: win (odds/100) * bet
                        winnings = betAmount * (odds / 100);
                    } else {
                        // Negative odds: win (100/abs(odds)) * bet
                        winnings = betAmount * (100 / Math.abs(odds));
                    }

                    const totalReturn = betAmount + winnings;
                    const newPoints = userData.points + totalReturn;
                    transaction.update(userRef, { points: newPoints });
                }
            }

            transaction.update(wagerRef, {
                status: 'settled',
                winningOption: winningOption,
            });
        });
    } catch (error) {
        console.error("Error settling wager: ", error);
        throw new Error("Could not settle wager.");
    }
};

/**
 * Sets up a real-time listener for the wagers collection, ordered by creation date.
 * @param callback - A function to be called with the updated array of wagers.
 * @returns An unsubscribe function to clean up the listener.
 */
export const onWagersUpdate = (callback: (wagers: Wager[]) => void) => {
    const q = query(wagersCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const wagers: Wager[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // This is a small, temporary migration step to handle the data model change.
            // Wagers created before per-option odds will not have `WagerOption[]`.
            if (data.options && data.options.length > 0 && typeof data.options[0] === 'string') {
                const migratedOptions = data.options.map((opt: string) => ({
                    text: opt,
                    odds: data.odds || 100, // Fallback to 100 if old top-level odds is missing
                }));
                data.options = migratedOptions;
                delete data.odds; // Remove the old top-level odds
            }

            wagers.push({
                id: doc.id,
                ...data,
            } as Wager);
        });
        callback(wagers);
    }, (error) => {
        console.error("Error fetching wagers: ", error);
    });

    return unsubscribe;
}; 