import { Message, MessageComponentProps } from '../../../types/messages/Message.types';
import { User } from '../../../types/login/User.types';
import { useState } from 'react';
import MessageView from './MessageView';

type UnifiedMessageProps = MessageComponentProps & {
    currentUser: User;
    handleChangeDeletionStatus: (
        id: string,
        messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>
    ) => void;
};

export default function MessageContainer({
    message,
    currentUser,
    handleChangeDeletionStatus
}: UnifiedMessageProps) {
    const firstNameInitial: string = message.user.firstName[0].toUpperCase();
    const isSent: boolean = message.user.id === currentUser.id;
    const isDeleted: boolean = message.isDeleted;
    const isPinned: boolean = message.isPinned;
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    console.log(message.content, message.isPinned);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirmation = async () => {
        await handleChangeDeletionStatus(message.id, {
            isPinned: message.isPinned,
            isDeleted
        });
        handleCloseDialog();
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
        />
    );
}
