export interface Message {
    id: string;
    text: string;
    avatar: string;
    userId: string;
}

export interface MessageComponentProps {
    message: string;
    avatar: string;
}
