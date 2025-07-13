import React from 'react';
import {
    Box,
    Typography,
    Modal,
    Backdrop,
    Fade,
    List,
    ListItem,
    ListItemButton,
} from '@mui/material';

interface SettleWagerModalProps {
    open: boolean;
    onClose: () => void;
    options: string[];
    onSettle: (winningOption: string) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper', // Use theme's paper color
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const SettleWagerModal: React.FC<SettleWagerModalProps> = ({ open, onClose, options, onSettle }) => {
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
                    <Typography variant="h5" component="h2" textAlign="center" sx={{ mb: 2 }}>
                        Settle the Wager
                    </Typography>
                    <Typography textAlign="center" sx={{ mb: 3 }}>
                        Choose the winning option below. This action cannot be undone.
                    </Typography>
                    <List>
                        {options.map((option) => (
                            <ListItem key={option} disablePadding>
                                <ListItemButton onClick={() => onSettle(option)} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">{option}</Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Fade>
        </Modal>
    );
};

export default SettleWagerModal; 