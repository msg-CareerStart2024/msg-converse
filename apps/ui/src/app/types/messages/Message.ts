export interface Message {
    id: string;
    text: string;
    firstNameInitial: string;
    userId: string;
}

export interface MessageComponentProps {
    message: string;
    firstNameInitial: string;
}
