import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import WagerCard from '../components/WagerCard';
import NewWagerModal from '../components/NewWagerModal';
import { onWagersUpdate, type Wager } from '../services/wagerService';
import { generateActivityFeed, type Activity } from '../services/activityService';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wagers, setWagers] = useState<Wager[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { currentUser } = useAuth();


    useEffect(() => {
        if (!currentUser) {
            setLoading(true);
            return;
        }
        setLoading(true);
        const unsubscribe = onWagersUpdate((newWagers) => {
            const activeWagers = newWagers.filter(wager => wager.status !== 'cancelled');
            setWagers(activeWagers);
            try {
                const newActivities = generateActivityFeed(newWagers);
                setActivities(newActivities);
            } catch (error) {
                console.error("Error processing wager data:", error);
                setActivities([]); // Clear activities on error
            } finally {
                setLoading(false); // This will now always run
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [currentUser]);

    return (
        <Box>
            <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }} // 2/3 for wagers, 1/3 for feed on desktop
                    gap={4}
                >
                    {/* Wager Board Column */}
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="h2" component="h1">
                                The Wager Board
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Current goings-on and bets
                            </Typography>
                        </Box>

                        {loading ? (
                            <Typography sx={{ textAlign: 'center' }}>Loading wagers...</Typography>
                        ) : !currentUser ? (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                Please log in to see wagers.
                            </Typography>
                        ) : wagers.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                No wagers yet. Why not post one?
                            </Typography>
                        ) : (
                            <Box
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    lg: 'repeat(3, 1fr)',
                                }}
                                gap={4}
                            >
                                {wagers.map((wager) => (
                                    <WagerCard wager={wager} key={wager.id} />
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Activity Feed Column - Only on Desktop */}
                    {isDesktop && (
                        <Box>
                            <ActivityFeed activities={activities} />
                        </Box>
                    )}
                </Box>

                {/* Floating Action Button for New Wager */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        borderRadius: '50px',
                        py: 1.5,
                        px: 3,
                        boxShadow: 3,
                    }}
                >
                    New Wager
                </Button>

                <NewWagerModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </Container>
        </Box>
    );
};

export default Dashboard; 