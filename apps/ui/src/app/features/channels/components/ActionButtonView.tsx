import { Button, Box } from '@mui/material';
import { CHANNEL_FORM_ACTION_TYPE } from '../../../types/channel/ChannelFormActionType.enums';

type ActionButtonProps = {
    action: CHANNEL_FORM_ACTION_TYPE;
    handleAction: () => void;
    disabled: boolean;
};

const ActionButtonView: React.FC<ActionButtonProps> = ({ action, handleAction, disabled }) => {
    const actionType = CHANNEL_FORM_ACTION_TYPE[action];

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
                disabled={disabled}
            >
                {actionType.replace('_', ' ')}
            </Button>
        </Box>
    );
};

export default ActionButtonView;
