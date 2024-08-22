export enum SocketEvent {
    JOIN_CHANNEL_CHAT = 'join_channel_chat',
    LEAVE_CHANNEL_CHAT = 'leave_channel_chat',
    CONNECTION_ERROR = 'connection_error',
    NEW_MESSAGE = 'new_message',
    SEND_MESSAGE = 'send_message',
    START_TYPING = 'start_typing',
    STOP_TYPING = 'stop_typing',
    TYPING_USERS = 'typing_users',
    TOGGLE_LIKE_MESSAGE_CLIENT = 'toggle_like_message_client',
    TOGGLE_LIKE_MESSAGE_SERVER = 'toggle_like_message_server',
    UPDATE_DELETED_STATUS = 'update_deleted_status',
    UPDATE_DELETED_STATUS_CLIENT = 'update_deleted_status_client'
}
