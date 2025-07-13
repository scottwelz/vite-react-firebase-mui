import React from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GavelIcon from '@mui/icons-material/Gavel';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Activity } from '../services/activityService';

interface ActivityFeedProps {
    activities: Activity[];
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    switch (type) {
        case 'wager_created':
            return <NewReleasesIcon color="primary" />;
        case 'bet_placed':
            return <MonetizationOnIcon color="secondary" />;
        case 'wager_settled':
            return <GavelIcon color="success" />;
        case 'wager_cancelled':
            return <CancelIcon color="error" />;
        default:
            return null;
    }
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Live Feed
            </Typography>
            <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {activities.map((activity) => (
                    <ListItem key={activity.id} alignItems="flex-start">
                        <ListItemIcon sx={{ mt: 0.5 }}>
                            <ActivityIcon type={activity.type} />
                        </ListItemIcon>
                        <ListItemText
                            primary={activity.text}
                            secondary={formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ActivityFeed; 