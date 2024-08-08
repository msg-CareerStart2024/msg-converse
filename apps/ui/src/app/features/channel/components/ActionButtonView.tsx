import React from 'react';
import { Button, Box } from '@mui/material';

type ActionButtonProps = {
    action: 'create' | 'update' | 'delete';
    handleAction: () => void;
    isSubmitting: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({ action, handleAction, isSubmitting }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 8 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAction}
                sx={{
                    width: 'fit-content',
                    alignSelf: 'flex-end',
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
                disabled={isSubmitting}
            >
                {action.charAt(0).toUpperCase() + action.slice(1)}{' '}
            </Button>
        </Box>
    );
};

export default ActionButton;
