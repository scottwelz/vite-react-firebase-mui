import React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
} from '@mui/material';
import {
    AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleGenericAction = () => {
        navigate('/some-other-page');
    };

    return (
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome to your dashboard.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleGenericAction}
                    size="large"
                >
                    Perform Action
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Dashboard Content Area
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    This is where your main dashboard content will go. Add components, data visualizations, or summaries here.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => alert('Another action clicked!')}
                >
                    Another Action
                </Button>
            </Paper>
        </Container>
    );
};

export default Dashboard; 