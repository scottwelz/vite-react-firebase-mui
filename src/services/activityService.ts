import type { Wager } from './wagerService';
import { Timestamp } from 'firebase/firestore';

export interface Activity {
    id: string;
    text: string;
    timestamp: Date;
    type: 'wager_created' | 'bet_placed' | 'wager_settled' | 'wager_cancelled';
}

/**
 * Transforms raw wager data into a sorted, human-readable activity feed.
 * @param wagers - An array of Wager objects from Firestore.
 * @returns A sorted array of Activity objects.
 */
export const generateActivityFeed = (wagers: Wager[]): Activity[] => {
    const activities: Activity[] = [];

    wagers.forEach(wager => {
        // 1. Activity for wager creation
        activities.push({
            id: wager.id,
            text: `${wager.author} created the wager: "${wager.title}"`,
            timestamp: (wager.createdAt as Timestamp)?.toDate() || new Date(),
            type: 'wager_created',
        });

        // 2. Activity for each bet placed
        wager.bets.forEach(bet => {
            activities.push({
                id: `${wager.id}-${bet.userId}`,
                text: `${bet.username} bet on "${bet.option}" for the wager "${wager.title}"`,
                timestamp: (bet.createdAt as Timestamp)?.toDate() || new Date(),
                type: 'bet_placed',
            });
        });

        // 3. Activity for wager settlement
        if (wager.status === 'settled' && wager.winningOption) {
            activities.push({
                id: `${wager.id}-settled`,
                text: `${wager.author} settled the wager "${wager.title}". The winner was "${wager.winningOption}".`,
                // We'll need to add a settledAt timestamp to wagers for this to be accurate
                // For now, we'll use the wager creation time as a fallback.
                timestamp: (wager.createdAt as Timestamp)?.toDate() || new Date(),
                type: 'wager_settled',
            });
        }

        // 4. Activity for wager cancellation
        if (wager.status === 'cancelled') {
            activities.push({
                id: `${wager.id}-cancelled`,
                text: `The wager "${wager.title}" was cancelled.`,
                timestamp: (wager.cancelledAt as Timestamp)?.toDate() || new Date(),
                type: 'wager_cancelled',
            });
        }
    });

    // Sort all activities chronologically, most recent first
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}; 