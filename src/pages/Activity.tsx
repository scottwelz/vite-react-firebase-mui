import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { onWagersUpdate, Wager } from '../services/wagerService';
import { generateActivityFeed, Activity } from '../services/activityService';
import ActivityFeed from '../components/ActivityFeed';

const ActivityPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onWagersUpdate((newWagers: Wager[]) => {
            const newActivities = generateActivityFeed(newWagers);
            setActivities(newActivities);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1">
                    Activity Feed
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    See what's been happening
                </Typography>
            </Box>

            {loading ? (
                <Typography>Loading activity...</Typography>
            ) : (
                <ActivityFeed activities={activities} />
            )}
        </Container>
    );
};

export default ActivityPage; 