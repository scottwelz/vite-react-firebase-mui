import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Container,
    Paper,
    TextField,
    CircularProgress,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

const Landing: React.FC = () => {
    const { signIn, createUsername } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Betting handle cannot be empty.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await signIn();
            await createUsername(user, username);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create username.');
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <ExploreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography component="h1" variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Welcome to Ozark Wagers
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: '80%' }}>
                        Create a betting handle to get started.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: '400px' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Betting Handle"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={!!error}
                            helperText={error}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Let's Fucking Go"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Landing; 