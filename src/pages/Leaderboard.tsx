import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
    Divider,
    CircularProgress,
    Tooltip,
    useTheme,
} from '@mui/material';
import { UserProfile } from '../contexts/AuthContext';
import { getAllUsers } from '../services/userService';
import { Wager, onWagersUpdate } from '../services/wagerService';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface UserLeaderboardProfile extends UserProfile {
    potentialWinnings: number;
}

const LeaderboardPage: React.FC = () => {
    const [users, setUsers] = useState<UserLeaderboardProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await getAllUsers();
            return userList;
        };

        const calculatePotentialWinnings = (wagers: Wager[], users: UserProfile[]): UserLeaderboardProfile[] => {
            const potentialWinningsMap: { [userId: string]: number } = {};

            // Initialize map for all users
            users.forEach(u => potentialWinningsMap[u.uid] = 0);

            const openWagers = wagers.filter(w => w.status === 'open');

            for (const wager of openWagers) {
                for (const bet of wager.bets) {
                    const option = wager.options.find(o => o.text === bet.option);
                    if (option) {
                        let winnings = 0;
                        if (option.odds > 0) {
                            winnings = bet.amount * (option.odds / 100);
                        } else {
                            winnings = bet.amount * (100 / Math.abs(option.odds));
                        }
                        potentialWinningsMap[bet.userId] = (potentialWinningsMap[bet.userId] || 0) + winnings;
                    }
                }
            }
            return users.map(u => ({ ...u, potentialWinnings: potentialWinningsMap[u.uid] || 0 }));
        };

        const setupListeners = async () => {
            setLoading(true);
            const initialUsers = await fetchUsers();

            const unsubscribe = onWagersUpdate((wagers) => {
                const usersWithWinnings = calculatePotentialWinnings(wagers, initialUsers);
                // Sort by points first, then by potential winnings
                usersWithWinnings.sort((a, b) => {
                    if (b.points !== a.points) {
                        return b.points - a.points;
                    }
                    return b.potentialWinnings - a.potentialWinnings;
                });
                setUsers(usersWithWinnings);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        setupListeners();
    }, []);

    return (
        <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
                    Leaderboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Who's on top?
                </Typography>
            </Box>

            <Paper elevation={3}>
                <List disablePadding>
                    <ListItem sx={{ py: 1, px: 3, backgroundColor: 'action.hover' }}>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <Box sx={{ flex: '1 1 50%' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    PLAYER
                                </Typography>
                            </Box>
                            <Box sx={{ flex: '0 0 25%', textAlign: 'right', pr: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    POINTS
                                </Typography>
                            </Box>
                            <Box sx={{ flex: '0 0 25%', textAlign: 'right' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    POTENTIAL TOTAL
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>
                </List>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List disablePadding>
                        {users.map((user, index) => (
                            <React.Fragment key={user.uid}>
                                <ListItem sx={{ py: 2, px: 3 }}>
                                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                        <Box sx={{ flex: '1 1 50%', display: 'flex', alignItems: 'center' }}>
                                            <ListItemAvatar sx={{ mr: 2, minWidth: 'auto' }}>
                                                <Avatar sx={{ width: 48, height: 48, bgcolor: index === 0 ? 'warning.main' : 'primary.main' }}>
                                                    {index === 0 ? <StarIcon /> : user.displayName.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.displayName}
                                                primaryTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: '0 0 25%', textAlign: 'right', pr: 2 }}>
                                            <Typography variant="h5" color={index === 0 ? 'warning.main' : 'text.primary'} sx={{ fontWeight: 700 }}>
                                                {`$${user.points.toLocaleString()}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '0 0 25%', textAlign: 'right' }}>
                                            {user.potentialWinnings > 0 ? (
                                                <Tooltip title="Includes potential winnings from open bets">
                                                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                                                        <span style={{ color: theme.palette.success.main, justifySelf: 'center' }}>
                                                            <TrendingUpIcon sx={{ fontSize: 24, color: theme.palette.success.main }} />
                                                        </span>
                                                        <span style={{ color: theme.palette.success.main, marginLeft: 4 }}>
                                                            {`+${Math.round(user.potentialWinnings).toLocaleString()}`}
                                                        </span>
                                                        <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                                                            {`($${Math.round(user.points + user.potentialWinnings).toLocaleString()})`}
                                                        </Typography>
                                                    </Typography>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    -
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < users.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default LeaderboardPage;
