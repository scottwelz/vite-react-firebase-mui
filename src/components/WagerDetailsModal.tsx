import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Fade,
    Backdrop,
    Typography,
    Divider,
    Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { placeBet, Wager } from '../services/wagerService';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

interface WagerDetailsModalProps {
    wager: Wager;
    open: boolean;
    onClose: () => void;
    initialOption?: string;
}

const WagerDetailsModal: React.FC<WagerDetailsModalProps> = ({ wager, open, onClose, initialOption }) => {
    const { currentUser } = useAuth();
    const [betAmount, setBetAmount] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setSelectedOption(initialOption || null);
            setBetAmount('');
            setError('');
        }
    }, [open, initialOption]);

    const handleOptionClick = (optionText: string) => {
        if (selectedOption === optionText) {
            setSelectedOption(null);
        } else {
            setSelectedOption(optionText);
        }
        setBetAmount('');
        setError('');
    };

    const handlePlaceBet = async () => {
        if (!currentUser?.profile || !selectedOption) {
            setError("Please select an option and ensure you're logged in.");
            return;
        }

        const amount = Number(betAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid bet amount.");
            return;
        }

        try {
            await placeBet(wager.id, currentUser.firebaseUser.uid, currentUser.profile.displayName, selectedOption, amount);
            onClose(); // Close modal on success
        } catch (err: any) {
            setError(err.message || "Failed to place bet.");
            console.error(err);
        }
    };

    const userBet = wager.bets.find(bet => bet.userId === currentUser?.firebaseUser?.uid);
    const hasBet = !!userBet;
    const isSettled = wager.status === 'settled';
    const isCutoff = wager.cutoffDate && wager.cutoffDate.toDate() < new Date();

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" textAlign="center" sx={{ mb: 2 }}>
                        {wager.title}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Choose an option:</Typography>
                    <Box
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(auto-fit, minmax(120px, 1fr))' }}
                        gap={1.5}
                        sx={{ mb: 3 }}
                    >
                        {wager.options.map((option) => {
                            const isSelected = selectedOption === option.text;
                            const isWinner = isSettled && wager.winningOption === option.text;
                            const isUserBet = hasBet && userBet?.option === option.text;

                            return (
                                <Button
                                    key={option.text}
                                    fullWidth
                                    variant={isSelected || isWinner || isUserBet ? "contained" : "outlined"}
                                    color={isWinner ? 'success' : 'primary'}
                                    onClick={() => handleOptionClick(option.text)}
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
                            );
                        })}
                    </Box>

                    {selectedOption && !hasBet && !isSettled && (
                        <Box>
                            <TextField
                                fullWidth
                                label={`Bet Amount for "${selectedOption}"`}
                                variant="outlined"
                                value={betAmount}
                                onChange={(e) => {
                                    if (/^[0-9]*$/.test(e.target.value)) {
                                        setBetAmount(e.target.value)
                                    }
                                }}
                                type="number"
                                sx={{ mb: 2 }}
                                error={!!error}
                                helperText={error}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handlePlaceBet}
                                >
                                    Confirm Bet
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onClose()}
                                >
                                    Discard Bet
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {hasBet && (
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            You have already bet on "{userBet?.option}" for {userBet?.amount} points.
                        </Typography>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
};

export default WagerDetailsModal; 