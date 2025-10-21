import { ErrorResponse, ValidationError } from "@/core/types";

/**
 * Error codes mapping
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  IMPOSSIBLE_WITHDRAWAL: 'IMPOSSIBLE_WITHDRAWAL',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST'
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * Creates a standardized error response
 * 
 * @param message - Error message
 * @param code - Error code
 * @returns ErrorResponse object
 */
export function createErrorResponse(message: string, code?: string): ErrorResponse {
  return {
    error: message,
    ...(code && { code })
  };
}

/**
 * Converts validation error to HTTP response
 * 
 * @param validationError - Validation error object
 * @returns Object with status and error response
 */
export function handleValidationError(validationError: ValidationError): {
  status: number;
  response: ErrorResponse;
} {
  const status = validationError.code === 'IMPOSSIBLE_AMOUNT' 
    ? HTTP_STATUS.UNPROCESSABLE_ENTITY 
    : HTTP_STATUS.BAD_REQUEST;

  return {
    status,
    response: createErrorResponse(validationError.message, validationError.code)
  };
}

/**
 * Handles internal server errors
 * 
 * @param error - Error object
 * @returns Object with status and error response
 */
export function handleInternalError(error: unknown): {
  status: number;
  response: ErrorResponse;
} {
  console.error('Internal server error:', error);
  
  return {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    response: createErrorResponse(
      'Erro interno do servidor. Tente novamente mais tarde.',
      ERROR_CODES.INTERNAL_ERROR
    )
  };
}

/**
 * Handles invalid request format
 * 
 * @returns Object with status and error response
 */
export function handleInvalidRequest(): {
  status: number;
  response: ErrorResponse;
} {
  return {
    status: HTTP_STATUS.BAD_REQUEST,
    response: createErrorResponse(
      'Formato de requisição inválido. Esperado: {"valor": number}',
      ERROR_CODES.INVALID_REQUEST
    )
  };
}
