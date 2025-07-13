import { Box, Button, Card, CardContent, Chip, Divider, Typography, AvatarGroup, Avatar, Tooltip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { settleWager, cancelWager } from '../services/wagerService';
import type { Wager } from '../services/wagerService';
import SettleWagerModal from './SettleWagerModal';
import WagerDetailsModal from './WagerDetailsModal';
import { useState } from 'react';
import { format } from 'date-fns';


// A sleek, modern card design
const StyledWagerCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSettled',
})<{ isSettled?: boolean }>(({ theme, isSettled }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    opacity: isSettled ? 0.7 : 1,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
    },
}));


interface WagerCardProps {
    wager: Wager;
}

const WagerCard = ({ wager }: WagerCardProps) => {
    const { currentUser } = useAuth();
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [initialOptionForModal, setInitialOptionForModal] = useState<string | undefined>();

    const handleOpenDetailsModal = (optionText: string) => {
        setInitialOptionForModal(optionText);
        setIsDetailsModalOpen(true);
    };

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this wager? This will refund all bets.')) {
            try {
                await cancelWager(wager.id);
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            }
        }
    }

    const handleSettle = async (winningOption: string) => {
        try {
            await settleWager(wager.id, winningOption);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
        setIsSettleModalOpen(false);
    };

    const isOwner = currentUser?.firebaseUser?.uid === wager.authorId;
    const userBet = wager.bets.find(bet => bet.userId === currentUser?.firebaseUser?.uid);
    const hasBet = !!userBet;
    const isSettled = wager.status === 'settled';
    const isCutoff = wager.cutoffDate && wager.cutoffDate.toDate() < new Date();


    return (
        <>
            <StyledWagerCard isSettled={isSettled}>
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        textAlign="center"
                        sx={{ mb: 2, textDecoration: isSettled ? 'line-through' : 'none' }}
                    >
                        {wager.title}
                    </Typography>

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Betting closes: {wager.cutoffDate ? format(wager.cutoffDate.toDate(), 'p P') : 'N/A'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(auto-fit, minmax(120px, 1fr))' }}
                        gap={1.5}
                        sx={{ mb: 2 }}
                    >
                        {wager.options.map((option) => (
                            <Button
                                key={option.text}
                                fullWidth
                                variant="outlined"
                                onClick={() => handleOpenDetailsModal(option.text)}
                                disabled={hasBet || isSettled || isCutoff}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <Typography variant="button">{option.text}</Typography>
                                    <Chip
                                        label={`${option.odds > 0 ? '+' : ''}${option.odds}`}
                                        size="small"
                                    />
                                </Box>
                            </Button>
                        ))}
                    </Box>

                    {isOwner && !isSettled && !isCutoff && (
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={handleCancel}
                            sx={{ mt: 2 }}
                        >
                            Cancel Wager
                        </Button>
                    )}

                    {isOwner && !isSettled && isCutoff && (
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsSettleModalOpen(true)}
                            sx={{ mt: 2 }}
                        >
                            Settle Wager
                        </Button>
                    )}

                    {wager.bets.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Divider sx={{ mb: 1.5 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Bettors:
                            </Typography>
                            <AvatarGroup max={6}>
                                {wager.bets.map(bet => (
                                    <Tooltip key={bet.userId} title={`${bet.username} bet on "${bet.option}" for ${bet.amount} points`}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                            {bet.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </AvatarGroup>
                        </Box>
                    )}
                </CardContent>

                <Divider />

                <Box sx={{ p: 1.5, textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">
                        Posted by: <strong>{wager.author}</strong>
                    </Typography>
                </Box>
            </StyledWagerCard>
            <SettleWagerModal
                open={isSettleModalOpen}
                onClose={() => setIsSettleModalOpen(false)}
                options={wager.options.map(opt => opt.text)}
                onSettle={handleSettle}
            />
            <WagerDetailsModal
                wager={wager}
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                initialOption={initialOptionForModal}
            />
        </>
    );
};

export default WagerCard; 