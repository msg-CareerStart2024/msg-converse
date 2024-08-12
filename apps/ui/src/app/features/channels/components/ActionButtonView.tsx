import { Button, Box } from '@mui/material';
import { ACTION_TYPE } from '../../../types/channel/channel.types';

type ActionButtonProps = {
    action: ACTION_TYPE;
    handleAction: () => void;
    isSubmitting: boolean;
};

const ActionButtonView: React.FC<ActionButtonProps> = ({ action, handleAction, isSubmitting }) => {
    const actionType = ACTION_TYPE[action];

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
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)}{' '}
            </Button>
        </Box>
    );
};

export default ActionButtonView;
