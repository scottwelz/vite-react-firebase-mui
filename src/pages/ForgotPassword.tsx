import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    Alert,
    CircularProgress,
    Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LockOutlined, EmailOutlined } from '@mui/icons-material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
    const theme = useTheme();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await resetPassword(email);
            setSuccess('Password reset email sent! Check your inbox.');
            setEmail('');
        } catch (err: any) {
            let errorMessage = 'Failed to reset password. Please try again.';

            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: theme.palette.background.default
            }}
        >
            <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <RestaurantMenuIcon
                        sx={{
                            color: theme.palette.primary.main,
                            fontSize: 40,
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            letterSpacing: '0.5px',
                            textShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                    >
                        REACT_TEMPLATE
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3
                        }}
                    >
                        <LockOutlined
                            sx={{
                                fontSize: 40,
                                p: 1,
                                color: 'white',
                                bgcolor: theme.palette.primary.main,
                                borderRadius: '50%',
                                mb: 1
                            }}
                        />
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <EmailOutlined sx={{ color: 'action.active', mr: 1 }} />
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.2,
                                position: 'relative'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                        <Stack direction="row" justifyContent="space-between">
                            <Link component={RouterLink} to="/login" variant="body2">
                                Back to Sign In
                            </Link>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ForgotPassword; 