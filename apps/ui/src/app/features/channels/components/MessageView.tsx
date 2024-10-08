import { PushPin, PushPinOutlined } from '@mui/icons-material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import RestoreIcon from '@mui/icons-material/Restore';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
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
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import { bindHover, bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import { getColor } from '../../../lib/avatar-colors';
import { User } from '../../../types/login/User.types';
import { UserRole } from '../../../types/login/UserRole.enum';
import { Message } from '../../../types/messages/Message.types';
import { generateUserName } from '../../../utils/utils';

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
    handleToggleLikeMessage: (message: string) => void;
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
    handleToggleLikeMessage,
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
        position: 'relative',
        marginBottom: 1,
        alignSelf: isSent ? 'end' : 'start'
    };

    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'messageMenu'
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSent ? 'row-reverse' : 'row',
                alignItems: 'center',
                wordBreak: 'break-word',
                justifyContent: isSent ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
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

                {(isCurrentUserAdmin || !isDeleted) && (
                    <HoverMenu
                        {...bindMenu(popupState)}
                        sx={{ display: 'flex', flexDirection: 'row' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', paddingX: 1, gap: 1 }}>
                            {!isDeleted && (
                                <IconButton
                                    onClick={() => handleToggleLikeMessage(message.id)}
                                    sx={{ gap: 1, alignItems: 'center' }}
                                >
                                    <Typography color="text.primary" fontWeight={600}>
                                        {message.likedByUsers?.length || 0}
                                    </Typography>
                                    {message.likedByUsers?.some(
                                        like => like.id === currentUser.id
                                    ) ? (
                                        <ThumbUpAltIcon />
                                    ) : (
                                        <ThumbUpOffAltIcon />
                                    )}
                                </IconButton>
                            )}
                            {isCurrentUserAdmin && (
                                <>
                                    <IconButton onClick={handleOpenDialog}>
                                        {isDeleted ? <RestoreIcon /> : <DeleteOutline />}
                                    </IconButton>
                                    {!isDeleted && (
                                        <IconButton onClick={handleOpenPinDialog}>
                                            {!isPinned ? <PushPinOutlined /> : <PushPin />}
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>
                    </HoverMenu>
                )}
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
        </Box>
    );
}
