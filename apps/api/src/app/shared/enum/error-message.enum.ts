export enum ErrorMessage {
    UNIQUE_CONSTRAINT = 'A record with the same identifier already exists.',
    DATABASE_ERROR = 'An error occurred while processing your request.',
    ENTITY_NOT_FOUND = 'The requested item was not found.',
    INTERNAL_SERVER_ERROR = 'An unexpected error occurred while processing your request.',
    DEFAULT = 'An unexepected error occurred.',
    FORBIDDEN = 'You have to authenticate to access this resource.',
    UNAUTHORIZED = 'You do not have permission to access this resource'
}
