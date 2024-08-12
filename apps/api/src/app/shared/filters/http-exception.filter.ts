import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

import { ErrorDetails } from '../interfaces/error-details.interface';
import { ErrorMessage } from '../enum/error-message.enum';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { ErrorType } from '../enum/error-type.enum';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, errorResponse } = this.getErrorResponse(exception, request);

        this.logError(request, exception);
        this.sendErrorResponse(response, status, errorResponse);
    }

    private getErrorResponse(
        exception: unknown,
        request: Request
    ): { status: number; errorResponse: ErrorResponse } {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            return {
                status,
                errorResponse: this.handleHttpException(exception, request, status)
            };
        }

        if (exception instanceof QueryFailedError) {
            return {
                status: HttpStatus.BAD_REQUEST,
                errorResponse: this.handleQueryFailedError(exception, request)
            };
        }

        if (exception instanceof EntityNotFoundError) {
            return {
                status: HttpStatus.NOT_FOUND,
                errorResponse: this.handleEntityNotFoundError(exception, request)
            };
        }

        if (exception instanceof ForbiddenException) {
            return {
                status: HttpStatus.FORBIDDEN,
                errorResponse: this.handleForbiddenException(exception, request)
            };
        }

        if (exception instanceof UnauthorizedException) {
            return {
                status: HttpStatus.UNAUTHORIZED,
                errorResponse: this.handleUnauthorizedException(exception, request)
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            errorResponse: this.handleUnknownError(exception, request)
        };
    }

    private handleHttpException(
        exception: HttpException,
        request: Request,
        status: number
    ): ErrorResponse {
        const exceptionResponse = exception.getResponse();

        return {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: this.getExceptionMessage(exceptionResponse),
            errorType: ErrorType.HTTP_EXCEPTION,
            details: this.getExceptionDetails(exceptionResponse)
        };
    }

    private handleQueryFailedError(exception: QueryFailedError, request: Request): ErrorResponse {
        const errorType = this.getQueryFailedErrorType(exception);
        const message = this.getQueryFailedErrorMessage(errorType);

        return {
            statusCode: HttpStatus.BAD_REQUEST,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            errorType,
            details: { errorMessage: exception.message }
        };
    }

    private getQueryFailedErrorType(exception: QueryFailedError): ErrorType {
        if (exception.message.includes('duplicate key')) {
            return ErrorType.UNIQUE_CONSTRAINT_VIOLATION;
        }
        return ErrorType.DATABASE_ERROR;
    }

    private getQueryFailedErrorMessage(errorType: ErrorType): string {
        switch (errorType) {
            case ErrorType.UNIQUE_CONSTRAINT_VIOLATION:
                return ErrorMessage.UNIQUE_CONSTRAINT;
            default:
                return ErrorMessage.DATABASE_ERROR;
        }
    }

    private handleEntityNotFoundError(
        exception: EntityNotFoundError,
        request: Request
    ): ErrorResponse {
        return {
            statusCode: HttpStatus.NOT_FOUND,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: ErrorMessage.ENTITY_NOT_FOUND,
            errorType: ErrorType.ENTITY_NOT_FOUND,
            details: { errorMessage: exception.message }
        };
    }

    private handleForbiddenException(
        exception: ForbiddenException,
        request: Request
    ): ErrorResponse {
        return {
            statusCode: HttpStatus.FORBIDDEN,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: ErrorMessage.FORBIDDEN,
            errorType: ErrorType.FORBIDDEN,
            details: { errorMessage: exception.message }
        };
    }

    private handleUnauthorizedException(
        exception: UnauthorizedException,
        request: Request
    ): ErrorResponse {
        return {
            statusCode: HttpStatus.UNAUTHORIZED,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: ErrorMessage.UNAUTHORIZED,
            errorType: ErrorType.UNAUTHORIZED,
            details: { errorMessage: exception.message }
        };
    }

    private handleUnknownError(exception: unknown, request: Request): ErrorResponse {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: ErrorMessage.INTERNAL_SERVER_ERROR,
            errorType: ErrorType.INTERNAL_SERVER_ERROR,
            details: {
                errorMessage: exception instanceof Error ? exception.message : 'Unknown error'
            }
        };
    }

    private getExceptionMessage(exceptionResponse: string | object): string {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            return Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message[0]
                : exceptionResponse.message;
        }
        return ErrorMessage.DEFAULT;
    }

    private getExceptionDetails(exceptionResponse: string | object): ErrorDetails | undefined {
        if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            const details = Object.fromEntries(
                Object.entries(exceptionResponse).filter(([key]) => key !== 'message')
            );
            return Object.keys(details).length > 0 ? (details as ErrorDetails) : undefined;
        }
        return undefined;
    }

    private logError(request: Request, exception: unknown): void {
        this.logger.error(
            `${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : 'Unknown error',
            HttpExceptionFilter.name
        );
    }

    private sendErrorResponse(
        response: Response,
        status: number,
        errorResponse: ErrorResponse
    ): void {
        response.status(status).json(errorResponse);
    }
}
