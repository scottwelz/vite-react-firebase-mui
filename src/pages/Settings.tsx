import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Stack,
    TextField,
    Button,
    Alert,
    IconButton,
    Breadcrumbs,
    Link,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { currentUser, updateUserProfile } = useAuth();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [displayName, setDisplayName] = useState(currentUser?.profile?.displayName || '');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            await updateUserProfile(displayName);
            setSuccess('Profile updated successfully');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
            <Breadcrumbs sx={{ mb: 2, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <Link
                    color="inherit"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/dashboard');
                    }}
                >
                    Dashboard
                </Link>
                <Typography color="text.primary" noWrap>Settings</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton
                    onClick={() => navigate('/dashboard')}
                    sx={{ mr: 1 }}
                    aria-label="back to dashboard"
                    size={isMobile ? "small" : "medium"}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    fontWeight={600}
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                >
                    Account Settings
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleUpdateProfile}>
                    <Stack spacing={3}>
                        <TextField
                            label="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />



                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{ mt: 1 }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default Settings; 