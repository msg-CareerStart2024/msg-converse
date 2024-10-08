export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    JOIN_CHANNEL_CHAT = 'join_channel_chat',
    LEAVE_CHANNEL_CHAT = 'leave_channel_chat',
    CONNECTION_ERROR = 'connection_error',
    PREVIOUS_MESSAGES = 'previous_messages',
    NEW_MESSAGE = 'new_message',
    SEND_MESSAGE = 'send_message',
    TOGGLE_LIKE_MESSAGE_CLIENT = 'toggle_like_message_client',
    TOGGLE_LIKE_MESSAGE_SERVER = 'toggle_like_message_server',
    PIN_FROM_CLIENT = 'pin_from_client',
    PIN_FROM_SERVER = 'pin_from_server',
    START_TYPING = 'start_typing',
    STOP_TYPING = 'stop_typing',
    TYPING_USERS = 'typing_users',
    UPDATE_DELETED_STATUS = 'update_deleted_status',
    UPDATE_DELETED_STATUS_CLIENT = 'update_deleted_status_client'
}
