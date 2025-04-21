import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    SwipeableDrawer,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
import ExploreIcon from '@mui/icons-material/Explore';

// Components
import Profile from './ProfileDropdown/Profile';
import NotificationDropdown from './NotificationDropdown';

// Hooks
// import { useUIStore } from '../store/uiStore'; // Keep this commented out
import { useAuth } from '../contexts/AuthContext';

// Drawer width
const drawerWidth = 240;

/**
 * Main layout component for the application template
 */
export const Layout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Context values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loading: authLoading } = useAuth();

    // --- Local state for drawer --- 
    const [drawerOpen, setDrawerOpen] = useState(true); // Default to open on desktop
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    // --- End local state --- 

    // Responsive handling
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Toggle drawer - uses local state setters
    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileDrawerOpen(!mobileDrawerOpen);
        } else {
            setDrawerOpen(!drawerOpen);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        // Use local state setter for mobile
        if (isMobile) setMobileDrawerOpen(false);
    };

    // Define generic Navigation Items
    const navItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { id: 'settings', text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    // Drawer header
    const DrawerHeader = () => (
        <>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: [1],
                    minHeight: { xs: '59px', sm: '59px' },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        flexGrow: 1,
                        justifyContent: drawerOpen || isMobile ? 'flex-start' : 'center'
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    <ExploreIcon
                        sx={{
                            color: theme.palette.primary.main,
                            fontSize: 28,
                            mr: (drawerOpen || isMobile) ? 1.5 : 0
                        }}
                    />
                    {(drawerOpen || isMobile) && (
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                letterSpacing: '0.5px',
                                whiteSpace: 'nowrap',
                                overflow: 'visible',
                                textShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                                fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.85
                                }
                            }}
                        >
                            App Name
                        </Typography>
                    )}
                </Box>
                {!isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
        </>
    );

    // Drawer content
    const DrawerContent = () => (
        <List component="nav" sx={{ px: isMobile ? 2 : drawerOpen ? 2 : 1 }}>
            {navItems.map((item) => (
                <Tooltip title={!drawerOpen && !isMobile ? item.text : ''} placement="right" key={item.id}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 2,
                                py: 1,
                                minHeight: 48,
                                justifyContent: drawerOpen || isMobile ? 'initial' : 'center',
                                px: 2.5,
                                mb: 1,
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.action.selected,
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: drawerOpen || isMobile ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ opacity: drawerOpen || isMobile ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );

    // Main Header (AppBar)
    const Header = () => (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...(drawerOpen && !isMobile && {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }),
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar sx={{ minHeight: { xs: '59px', sm: '59px' } }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{ mr: 2, ...(drawerOpen && !isMobile && { display: 'none' }) }}
                >
                    <MenuIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationDropdown />
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );

    // Loading state for the entire layout (while auth is loading)
    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Header */}
            <Header />

            {/* Drawer */}
            {isMobile ? (
                <SwipeableDrawer
                    container={document.body}
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={handleDrawerToggle}
                    onOpen={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <DrawerHeader />
                    <DrawerContent />
                </SwipeableDrawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box',
                        ...(drawerOpen && {
                            width: drawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                transition: theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                                overflowX: 'hidden',
                                borderRight: 'none',
                            },
                        }),
                        ...(!drawerOpen && {
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            overflowX: 'hidden',
                            width: `calc(${theme.spacing(8)} + 1px)`,
                            [theme.breakpoints.up('sm')]: {
                                width: `calc(${theme.spacing(9)} + 1px)`,
                            },
                            '& .MuiDrawer-paper': {
                                transition: theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.leavingScreen,
                                }),
                                overflowX: 'hidden',
                                width: `calc(${theme.spacing(8)} + 1px)`,
                                [theme.breakpoints.up('sm')]: {
                                    width: `calc(${theme.spacing(9)} + 1px)`,
                                },
                                borderRight: 'none',
                            },
                        }),
                    }}
                    open={drawerOpen}
                >
                    <DrawerHeader />
                    <DrawerContent />
                </Drawer>
            )}

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: '59px',
                    backgroundColor: theme.palette.grey[100],
                    minHeight: 'calc(100vh - 59px)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 