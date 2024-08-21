import { MessageComponentProps } from '../../../types/messages/Message.types';
import { User } from '../../../types/login/User.types';
import { useState } from 'react';
import MessageView from './MessageView';

type UnifiedMessageProps = MessageComponentProps & {
    currentUser: User;
    handleChangeDeletionStatus: (id: string, isDeleted: boolean) => void;
};

export default function MessageContainer({
    message,
    currentUser,
    handleChangeDeletionStatus
}: UnifiedMessageProps) {
    const firstNameInitial: string = message.user.firstName[0].toUpperCase();
    const isSent: boolean = message.user.id === currentUser.id;
    const isDeleted: boolean = message.isDeleted;
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirmation = async () => {
        handleChangeDeletionStatus(message.id, isDeleted);
        handleCloseDialog();
    };

    return (
        <MessageView
            message={message}
            currentUser={currentUser}
            firstNameInitial={firstNameInitial}
            isSent={isSent}
            isDeleted={isDeleted}
            dialogOpen={dialogOpen}
            handleOpenDialog={handleOpenDialog}
            handleCloseDialog={handleCloseDialog}
            handleDialogConfirmation={handleDialogConfirmation}
        />
    );
}
