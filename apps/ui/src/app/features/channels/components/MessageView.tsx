import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemText,
    MenuItem,
    Tooltip,
    Typography
} from '@mui/material';
import { getColor } from '../../../lib/avatar-colors';
import { UserRole } from '../../../types/login/UserRole.enum';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import { bindHover, bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useTheme } from '@mui/material';
import { Message } from '../../../types/messages/Message.types';
import { User } from '../../../types/login/User.types';
import { generateUserName } from '../../../utils/utils';
import { PushPin, PushPinOutlined } from '@mui/icons-material';

type MessageProps = {
    message: Message;
    currentUser: User;
    firstNameInitial: string;
    isSent: boolean;
    isDeleted: boolean;
    isPinned: boolean;
    dialogOpen: boolean;
    handleOpenDialog: () => void;
    handleCloseDialog: () => void;
    handleDialogConfirmation: () => void;
    pinDialogOpen: boolean;
    handleOpenPinDialog: () => void;
    handleClosePinDialog: () => void;
    handlePinDialogConfirmation: () => void;
};

export default function MessageView({
    message,
    currentUser,
    firstNameInitial,
    isSent,
    isDeleted,
    isPinned,
    dialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleDialogConfirmation,
    pinDialogOpen,
    handleOpenPinDialog,
    handleClosePinDialog,
    handlePinDialogConfirmation
}: MessageProps) {
    const theme = useTheme();
    const isCurrentUserAdmin = currentUser.role === UserRole.ADMIN;
    const avatarStyle = {
        marginInline: 2,
        backgroundColor: getColor(firstNameInitial)
    };

    const messageBoxStyle = {
        width: 'fit-content',
        backgroundColor: isSent ? theme.palette.secondary.main : theme.palette.primary.main,
        opacity: isDeleted ? '60%' : '100%',
        color: isSent ? 'black' : 'white',
        borderRadius: '20px',
        padding: 1,
        paddingX: 2,
        textAlign: isSent ? 'left' : 'right',
        position: 'relative',
        marginBottom: 1
    };

    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'messageMenu'
    });

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSent ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    justifyContent: isSent ? 'flex-end' : 'flex-start'
                }}
            >
                <Tooltip
                    title={
                        <Typography sx={{ fontSize: '1.25rem' }}>
                            {generateUserName(message.user.firstName, message.user.lastName)}
                        </Typography>
                    }
                    placement={isSent ? 'right-start' : 'left-start'}
                    arrow
                >
                    <Avatar variant="circular" sx={avatarStyle}>
                        {firstNameInitial}
                    </Avatar>
                </Tooltip>
                <Box sx={messageBoxStyle} {...bindHover(popupState)}>
                    <ListItemText
                        primary={
                            !isDeleted
                                ? message.content
                                : currentUser.role === UserRole.ADMIN
                                  ? 'This message was removed by a Moderator'
                                  : currentUser.role === UserRole.USER
                                    ? 'This message was removed by a Board Administrator'
                                    : ''
                        }
                    />

                    <HoverMenu
                        {...bindMenu(popupState)}
                        sx={{ display: 'flex', flexDirection: 'row' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Box sx={{ display: 'flex' }}>
                            {isCurrentUserAdmin && (
                                <>
                                    <MenuItem
                                        onClick={handleOpenDialog}
                                        sx={{
                                            '&:hover': {
                                                background: 'none'
                                            },
                                            maxHeight: '25px'
                                        }}
                                    >
                                        <IconButton>
                                            {isDeleted ? <RestoreIcon /> : <DeleteIcon />}
                                        </IconButton>
                                    </MenuItem>
                                    {!isDeleted && (
                                        <MenuItem
                                            onClick={handleOpenPinDialog}
                                            sx={{
                                                '&:hover': {
                                                    background: 'none'
                                                },
                                                maxHeight: '25px'
                                            }}
                                        >
                                            <IconButton>
                                                {isPinned ? <PushPinOutlined /> : <PushPin />}
                                            </IconButton>
                                        </MenuItem>
                                    )}
                                </>
                            )}
                        </Box>
                    </HoverMenu>
                </Box>
            </Box>
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {!message.isDeleted
                        ? 'Are you sure you want to delete this message?'
                        : 'Are you sure you want to restore this message?'}
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    Please confirm your action
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDialogConfirmation}
                        variant="contained"
                        color="secondary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={pinDialogOpen}
                onClose={handleClosePinDialog}
                aria-labelledby="alert-pin-dialog-title"
                aria-describedby="alert-pin-dialog-description"
            >
                <DialogTitle id="alert-pin-dialog-title">
                    {`Are you sure you want to ${isPinned ? 'unpin' : 'pin'} this message?`}
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    Please confirm your action
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePinDialog} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePinDialogConfirmation}
                        variant="contained"
                        color="secondary"
                    >
                        {isPinned ? 'UNPIN' : 'PIN'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
