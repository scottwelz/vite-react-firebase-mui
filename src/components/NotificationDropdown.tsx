import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Box,
    Typography,
    Divider,
    Button,
    CircularProgress,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { formatDistanceToNow } from 'date-fns';
import {
    FirestoreNotification,
    subscribeToNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';

const NotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<FirestoreNotification[]>([]); // Use FirestoreNotification interface
    const [loading, setLoading] = useState(true); // Start loading initially
    const [error, setError] = useState<string | null>(null); // Add error state
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { currentUser } = useAuth();

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setError(null); // Clear error on open
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (!currentUser) {
            setNotifications([]); // Clear notifications if user logs out
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const unsubscribe = subscribeToNotifications(
            currentUser.uid, // Pass user ID
            15, // Fetch up to 15 notifications
            (notificationList) => {
                setNotifications(notificationList);
                setLoading(false);
                setError(null); // Clear error on successful fetch
            },
            // Optional error handler passed to subscribe function (if service supports it)
            // (err) => {
            //     console.error("Error in notification subscription:", err);
            //     setError("Failed to load notifications.");
            //     setLoading(false);
            // }
        );

        // Cleanup subscription on unmount or user change
        return () => unsubscribe();

    }, [currentUser]); // Depend only on currentUser

    const handleNotificationClick = async (notification: FirestoreNotification) => {
        if (!currentUser) return;

        try {
            if (!notification.read) {
                // Mark as read in Firestore
                await markNotificationAsRead(currentUser.uid, notification.id);
                // Optimistic update (optional, subscription should handle it)
                // setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
            }

            console.log('Notification clicked:', notification.id, notification.data);
            // --- Navigation Logic (Adapt based on your app's needs) ---
            // Example: Navigate to alert details page if alertId is present
            if (notification.data?.alertId) {
                // navigate(`/alert/${notification.data.alertId}`); // Adjust route as needed
                console.log("Navigate to alert: ", notification.data.alertId);
            } else if (notification.data?.permitAreaId) {
                // Or maybe link to recreation.gov page?
                const recGovUrl = `https://www.recreation.gov/permits/${notification.data.permitAreaId}`;
                window.open(recGovUrl, '_blank');
                console.log("Open rec.gov page: ", recGovUrl);
            }
            // --- End Navigation Logic ---

            handleClose(); // Close dropdown after click
        } catch (err) {
            console.error('Error handling notification click:', err);
            // Maybe show a snackbar error?
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'alert_found':
                return <NotificationsIcon color="success" />;
            case 'alert_error':
                return <InfoIcon color="error" />;
            default:
                return <InfoIcon color="info" />;
        }
    };

    const formatNotificationTime = (timestamp: Date | null) => {
        if (!timestamp) return 'Just now'; // Fallback for potentially missing timestamps
        return formatDistanceToNow(timestamp, { addSuffix: true });
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser || unreadCount === 0) return;

        setLoading(true); // Show temporary loading
        try {
            await markAllNotificationsAsRead(currentUser.uid);
            // Optimistic update (optional, subscription should handle it)
            // setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            setError('Failed to update notifications.'); // Show error
        } finally {
            // Subscription should update loading, but set false as fallback
            // setLoading(false); 
        }
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 350,
                        maxHeight: 400,
                        overflow: 'auto'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    <Button
                        size="small"
                        startIcon={<DoneAllIcon />}
                        onClick={handleMarkAllAsRead} // Uses service function
                        color="primary"
                        disabled={unreadCount === 0 || loading} // Disable if no unread or loading
                    >
                        Mark all read
                    </Button>
                </Box>

                <Divider />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="error" variant="body2">{error}</Typography>
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">No new notifications</Typography>
                    </Box>
                ) : (
                    notifications.map(notification => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)} // Uses service function
                            sx={{
                                py: 1.5,
                                px: 2,
                                bgcolor: notification.read ? 'transparent' : 'action.hover',
                                '&:hover': {
                                    bgcolor: notification.read ? 'action.hover' : 'action.selected'
                                }
                            }}
                        >
                            <ListItemIcon>
                                {getNotificationIcon(notification.type)}
                            </ListItemIcon>
                            <ListItemText
                                primary={notification.message}
                                secondary={formatNotificationTime(notification.createdAt ?? null)} // Handle potentially null createdAt
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: notification.read ? 'normal' : 'bold',
                                    color: 'text.primary',
                                    sx: {
                                        display: 'block',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                        mb: 0.5
                                    }
                                }}
                                secondaryTypographyProps={{
                                    variant: 'caption',
                                    color: 'text.secondary'
                                }}
                            />
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationDropdown;
