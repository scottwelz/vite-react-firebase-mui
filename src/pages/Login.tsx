import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Stack
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, LoginOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

interface LocationState {
    from?: {
        pathname: string;
    };
}

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: true
    });

    const fromPath = (location.state as LocationState)?.from?.pathname || '/dashboard';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'remember' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(fromPath, { replace: true });
        } catch (err: any) {
            let errorMessage = 'Failed to sign in. Please check your credentials.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.';
            }
            setError(errorMessage);
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
            <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
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
                            Sign in
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
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
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="remember"
                                    color="primary"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />
                            }
                            label="Remember me"
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
                            startIcon={<LoginOutlined />}
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
                                'Sign In'
                            )}
                        </Button>
                        <Stack direction="row" justifyContent="space-between">
                            <Link component={RouterLink} to="/forgot-password" variant="body2">
                                Forgot password?
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

export default Login; 