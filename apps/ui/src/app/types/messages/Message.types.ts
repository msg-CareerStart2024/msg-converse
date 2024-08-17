import { User } from '../login/User.types';

export interface Message {
    id: string;
    content: string;
    isPinned: boolean;
    isDeleted: boolean;
    createdAt: Date;
    user: User;
}

export interface MessageComponentProps {
    message: Message;
    user: User;
}
