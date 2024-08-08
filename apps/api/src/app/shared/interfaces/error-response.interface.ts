import { ErrorDetails } from './error-details.interface';

export interface ErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    errorType: string;
    details?: ErrorDetails;
}
