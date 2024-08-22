import { MessageComponentProps } from '../../../types/messages/Message.types';
import { User } from '../../../types/login/User.types';
import { useState } from 'react';
import MessageView from './MessageView';

type UnifiedMessageProps = MessageComponentProps & {
    currentUser: User;
    handlePinStatus: (messageId: string, pinStatus: boolean) => void;
    handleChangeDeletionStatus: (id: string, isDeleted: boolean) => void;
};

export default function MessageContainer({
    message,
    currentUser,
    handleChangeDeletionStatus,
    handlePinStatus
}: UnifiedMessageProps) {
    const firstNameInitial: string = message.user.firstName[0].toUpperCase();
    const isSent: boolean = message.user.id === currentUser.id;
    const isDeleted: boolean = message.isDeleted;
    const isPinned: boolean = message.isPinned;

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    const handleDialogConfirmation = () => {
        handleChangeDeletionStatus(message.id, isDeleted);
        handleCloseDialog();
    };

    const [pinDialogOpen, setPinDialogOpen] = useState<boolean>(false);
    const handleOpenPinDialog = () => {
        setPinDialogOpen(true);
    };
    const handleClosePinDialog = () => {
        setPinDialogOpen(false);
    };
    const handlePinDialogConfirmation = () => {
        handlePinStatus(message.id, !message.isPinned);
        handleClosePinDialog();
    };

    return (
        <MessageView
            message={message}
            currentUser={currentUser}
            firstNameInitial={firstNameInitial}
            isSent={isSent}
            isDeleted={isDeleted}
            isPinned={isPinned}
            dialogOpen={dialogOpen}
            handleOpenDialog={handleOpenDialog}
            handleCloseDialog={handleCloseDialog}
            handleDialogConfirmation={handleDialogConfirmation}
            pinDialogOpen={pinDialogOpen}
            handleOpenPinDialog={handleOpenPinDialog}
            handleClosePinDialog={handleClosePinDialog}
            handlePinDialogConfirmation={handlePinDialogConfirmation}
        />
    );
}
