import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';

// project imports
import MainCard from '../MainCard';
import Transitions from '../Transitions';

// icons
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// hooks
import { useAuth } from '../../contexts/AuthContext';

// ==============================|| PROFILE DROPDOWN ||============================== //

const Profile: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
            return;
        }
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            setOpen(false);
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSettings = () => {
        setOpen(false);
        navigate('/settings');
    };

    // Extract user information
    const userName = currentUser?.displayName || 'User';
    const userEmail = currentUser?.email || '';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: open ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    borderRadius: '50%',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    '&:focus-visible': { outline: `2px solid ${theme.palette.primary.dark}`, outlineOffset: 2 },
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    {userInitial}
                </Avatar>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9],
                            },
                        },
                    ],
                }}
                sx={{ zIndex: 1100 }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.shadows[4],
                                width: 290,
                                minWidth: 240,
                                maxWidth: { xs: 290, sm: 290 },
                                borderRadius: 1.5
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard elevation={0} border={false} content={false}>
                                    {/* User Info Section */}
                                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    bgcolor: theme.palette.primary.main,
                                                    color: '#fff',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {userInitial}
                                            </Avatar>
                                            <Stack spacing={0.5}>
                                                <Typography variant="h6">{userName}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {userEmail}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    {/* Settings & Options Section */}
                                    <Box sx={{ p: 0 }}>
                                        <List component="nav" sx={{ p: 0 }}>
                                            <ListItemButton onClick={handleSettings} sx={{ py: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <SettingsIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Settings"
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItemButton>

                                            <Divider />

                                            <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <LogoutIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Logout"
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile; 