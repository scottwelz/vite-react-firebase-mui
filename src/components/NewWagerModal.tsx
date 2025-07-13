import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Modal,
    Backdrop,
    Fade,
    Switch,
    FormGroup,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
} from '@mui/material';
import { AddCircleOutline as AddIcon, RemoveCircleOutline as RemoveIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAuth } from '../contexts/AuthContext';
import { createWager, NewWager, placeBet } from '../services/wagerService';
import { Timestamp } from 'firebase/firestore';

interface NewWagerModalProps {
    open: boolean;
    onClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper', // Use theme's paper color
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

type EditableWagerOption = {
    text: string;
    odds: string; // Use string to allow for empty input
    isNegative: boolean;
};

const NewWagerModal: React.FC<NewWagerModalProps> = ({ open, onClose }) => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<EditableWagerOption[]>([
        { text: 'Yes', odds: '100', isNegative: false },
        { text: 'No', odds: '100', isNegative: true },
    ]);
    const [cutoffDate, setCutoffDate] = useState<Date | null>(new Date());
    const [betAmount, setBetAmount] = useState('');
    const [selectedOptionForBet, setSelectedOptionForBet] = useState<string>('');
    const [error, setError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setTitle('');
            setOptions([
                { text: 'Yes', odds: '100', isNegative: false },
                { text: 'No', odds: '100', isNegative: true },
            ]);
            // Set default cutoff to 24 hours from now
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setCutoffDate(tomorrow);
            setError('');
            setBetAmount('');
            setSelectedOptionForBet('');
        }
    }, [open]);

    const handleOptionTextChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleOptionOddsChange = (index: number, value: string) => {
        const newOptions = [...options];
        // Allow only numeric input, but store as string
        if (/^[0-9]*$/.test(value)) {
            newOptions[index].odds = value;
            setOptions(newOptions);
        }
    };

    const handleOptionSignChange = (index: number, checked: boolean) => {
        const newOptions = [...options];
        newOptions[index].isNegative = checked;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { text: '', odds: '100', isNegative: false }]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numeric input
        if (/^[0-9]*$/.test(value)) {
            setBetAmount(value);
        }
    };

    const handleSelectedOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === selectedOptionForBet) {
            setSelectedOptionForBet('');
            setBetAmount('');
        } else {
            setSelectedOptionForBet(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || options.some(opt => !opt.text.trim() || !opt.odds.trim())) {
            setError('Please fill out all fields, including odds for each option.');
            return;
        }

        if (!cutoffDate || cutoffDate < new Date()) {
            setError('Cutoff date must be in the future.');
            return;
        }

        if (!currentUser?.profile) {
            setError('You must have a username to create a wager.');
            return;
        }

        if (betAmount && !selectedOptionForBet) {
            setError('Please select an option to place your bet on.');
            return;
        }

        if (selectedOptionForBet && (!betAmount || Number(betAmount) <= 0)) {
            setError('Please enter a valid bet amount greater than 0.');
            return;
        }

        try {
            const newWager: NewWager = {
                title: title.trim(),
                options: options.map(opt => ({
                    text: opt.text,
                    odds: opt.isNegative ? -Math.abs(Number(opt.odds)) : Number(opt.odds)
                })),
                author: currentUser.profile.displayName,
                authorId: currentUser.firebaseUser.uid,
                cutoffDate: Timestamp.fromDate(cutoffDate),
            };
            const wagerId = await createWager(newWager);

            if (selectedOptionForBet && betAmount && Number(betAmount) > 0 && currentUser?.profile) {
                await placeBet(
                    wagerId,
                    currentUser.firebaseUser.uid,
                    currentUser.profile.displayName,
                    selectedOptionForBet,
                    Number(betAmount)
                );
            }

            onClose(); // Close modal on success
        } catch (err: any) {
            setError(err.message || 'Failed to create wager. Please try again.');
            console.error(err);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography variant="h4" component="h1" textAlign="center" sx={{ mb: 4 }}>
                        Post a New Wager
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Wager Title / Question"
                            variant="filled"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="h6" sx={{ mb: 1 }}>Options</Typography>
                        {options.map((option, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                                <TextField
                                    label={`Option ${index + 1}`}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={option.text}
                                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                />
                                <FormGroup sx={{ ml: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={option.isNegative}
                                                onChange={(e) => handleOptionSignChange(index, e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={option.isNegative ? '-' : '+'}
                                        labelPlacement="start"
                                    />
                                </FormGroup>
                                <TextField
                                    label="Odds"
                                    variant="outlined"
                                    size="small"
                                    value={option.odds}
                                    onChange={(e) => handleOptionOddsChange(index, e.target.value)}
                                    sx={{ width: '120px' }}
                                />
                                {options.length > 2 && (
                                    <IconButton onClick={() => removeOption(index)} color="warning">
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            sx={{ mb: 3 }}
                        >
                            Add Option
                        </Button>

                        <DateTimePicker
                            label="Betting Cutoff Time"
                            value={cutoffDate}
                            onChange={(newValue) => setCutoffDate(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    sx: { mb: 3 }
                                },
                            }}
                        />

                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Place Your Bet (Optional)
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 1, width: '100%' }}>
                            <FormLabel component="legend">Choose an option</FormLabel>
                            <RadioGroup
                                row
                                value={selectedOptionForBet}
                                onChange={handleSelectedOptionChange}
                            >
                                {options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option.text}
                                        control={<Radio size="small" />}
                                        label={option.text || `Option ${index + 1}`}
                                        disabled={!option.text.trim()}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            label="Bet Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={betAmount}
                            onChange={handleBetAmountChange}
                            disabled={!selectedOptionForBet}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">points</InputAdornment>,
                            }}
                        />


                        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Post It!
                        </Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default NewWagerModal; 