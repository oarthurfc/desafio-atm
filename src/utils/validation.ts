import { ValidationError } from "@/core/types";

export const VALIDATION_ERRORS = {
  INVALID_TYPE: 'O valor deve ser um número',
  NOT_INTEGER: 'O valor deve ser um número inteiro',
  NEGATIVE: 'O valor deve ser positivo',
  ZERO: 'O valor deve ser maior que zero',
  IMPOSSIBLE_AMOUNT: 'Não é possível sacar este valor com as cédulas disponíveis',
  MISSING_FIELD: 'Campo "valor" é obrigatório',
  INVALID_REQUEST: 'Formato de requisição inválido'
} as const;

/**
 * Validates withdrawal amount input
 * 
 * @param value - The value to validate
 * @returns ValidationError | null
 */
export function validateWithdrawalAmount(value: unknown): ValidationError | null {
  // Check if value is provided
  if (value === undefined || value === null) {
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.MISSING_FIELD,
      code: 'MISSING_FIELD'
    };
  }

  // Check if value is a number
  if (typeof value !== 'number') {
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.INVALID_TYPE,
      code: 'INVALID_TYPE'
    };
  }

  // Check if value is an integer
  if (!Number.isInteger(value)) {
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.NOT_INTEGER,
      code: 'NOT_INTEGER'
    };
  }

  // Check if value is positive
  if (value <= 0) {
    if (value === 0) {
      return {
        field: 'valor',
        message: VALIDATION_ERRORS.ZERO,
        code: 'ZERO'
      };
    }
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.NEGATIVE,
      code: 'NEGATIVE'
    };
  }

  // Check if amount can be dispensed
  if (value === 1 || value === 3) {
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.IMPOSSIBLE_AMOUNT,
      code: 'IMPOSSIBLE_AMOUNT'
    };
  }

  return null; // Valid
}

/**
 * Validates request body structure
 * 
 * @param body - Request body object
 * @returns ValidationError | null
 */
export function validateRequestBody(body: unknown): ValidationError | null {
  if (!body || typeof body !== 'object') {
    return {
      field: 'body',
      message: VALIDATION_ERRORS.INVALID_REQUEST,
      code: 'INVALID_REQUEST'
    };
  }

  const requestBody = body as Record<string, unknown>;
  
  if (!('valor' in requestBody)) {
    return {
      field: 'valor',
      message: VALIDATION_ERRORS.MISSING_FIELD,
      code: 'MISSING_FIELD'
    };
  }

  return validateWithdrawalAmount(requestBody.valor);
}