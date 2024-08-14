import { User } from '../login/User';

export interface Message {
    id: string;
    content: string;
    isPinned: boolean;
    createdAt: Date;
    user: User;
}

export interface MessageComponentProps {
    message: string;
    firstNameInitial: string;
}
