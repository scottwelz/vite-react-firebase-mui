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
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { formatDistanceToNow } from 'date-fns';
import {
    Notification,
    onNotificationsUpdate,
    markNotificationAsRead,
} from '../services/notificationService'; // Using the new service
import { useAuth } from '../contexts/AuthContext';
import NotesIcon from '@mui/icons-material/Notes';

const NotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { currentUser } = useAuth();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (!currentUser?.firebaseUser?.uid) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = onNotificationsUpdate(
            currentUser.firebaseUser.uid,
            (notificationList) => {
                setNotifications(notificationList);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markNotificationAsRead(notification.id);
        }
        // For now, we don't have a single wager view, so we'll just close the dropdown.
        // In the future, we could navigate to the wager on the dashboard.
        // navigate(`/dashboard#${notification.wagerId}`);
        handleClose();
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser?.firebaseUser?.uid || unreadCount === 0) return;

        // In a real app, you'd batch this update. For simplicity, we'll do it one-by-one.
        const unreadNotifications = notifications.filter(n => !n.isRead);
        await Promise.all(unreadNotifications.map(n => markNotificationAsRead(n.id)));
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
                        width: 360,
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
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0 || loading}
                    >
                        Mark all as read
                    </Button>
                </Box>

                <Divider />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">You're all caught up!</Typography>
                    </Box>
                ) : (
                    notifications.map(notification => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            sx={{
                                py: 1.5,
                                px: 2,
                                bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                whiteSpace: 'normal',
                            }}
                        >
                            <ListItemIcon>
                                <NotesIcon color={notification.isRead ? 'disabled' : 'primary'} />
                            </ListItemIcon>
                            <ListItemText
                                primary={notification.message}
                                secondary={
                                    notification.createdAt
                                        ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })
                                        : 'just now'
                                }
                                primaryTypographyProps={{
                                    fontWeight: notification.isRead ? 'normal' : 'bold',
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
