import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    Drawer as MuiDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Chip,
} from '@mui/material';
import { useTheme, styled, CSSObject, Theme } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ActivityIcon from '@mui/icons-material/Timeline';
import LeaderboardIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';


// Components
import Profile from './ProfileDropdown/Profile';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../contexts/AuthContext';

// Drawer width
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


/**
 * Main layout component for the application template
 */
export const Layout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { currentUser } = useAuth();

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);


    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) setMobileDrawerOpen(false);
    };

    const navItems = [
        { id: 'dashboard', text: 'Wager Board', icon: <DashboardIcon />, path: '/dashboard' },
        { id: 'activity', text: 'Activity Feed', icon: <ActivityIcon />, path: '/activity' },
        { id: 'leaderboard', text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
        { id: 'settings', text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <DrawerHeader sx={{ justifyContent: 'space-between', pl: 2 }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <ExploreIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" color="primary">
                        Ozark Wagers
                    </Typography>
                </Box>
            </DrawerHeader>
            <List component="nav" sx={{ px: 2 }}>
                {navItems.map((item) => (
                    <Tooltip title={isMobile || desktopDrawerOpen ? '' : item.text} placement="right" key={item.id}>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    minHeight: 48,
                                    justifyContent: desktopDrawerOpen || isMobile ? 'initial' : 'center',
                                    px: 2.5,
                                    mb: 1,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: desktopDrawerOpen || isMobile ? 3 : 0,
                                        justifyContent: 'center',
                                        color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ display: desktopDrawerOpen || isMobile ? 'block' : 'none' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: theme.palette.background.default,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setMobileDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        {navItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {currentUser?.profile && (
                            <Chip
                                label={`$${currentUser.profile.points.toLocaleString()}`}
                                color="primary"
                                variant="filled"
                                sx={{ fontWeight: 600 }}
                            />
                        )}
                        <NotificationDropdown />
                        <Profile />
                    </Box>
                </Toolbar>
            </AppBar>

            {isMobile ? (
                <MuiDrawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    ModalProps={{ keepMounted: true }} // Better open performance on mobile.
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </MuiDrawer>
            ) : (
                <Drawer variant="permanent" open={desktopDrawerOpen}
                    onMouseEnter={() => setDesktopDrawerOpen(true)}
                    onMouseLeave={() => setDesktopDrawerOpen(false)}
                >
                    {drawerContent}
                </Drawer>
            )}

            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 