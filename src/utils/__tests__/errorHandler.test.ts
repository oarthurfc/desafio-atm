import {
  createErrorResponse,
  handleValidationError,
  handleInternalError,
  handleInvalidRequest,
  ERROR_CODES,
  HTTP_STATUS
} from '@/utils/errorHandler'

describe('Error Handler utilities', () => {
  describe('createErrorResponse', () => {
    it('should create error response with message only', () => {
      const result = createErrorResponse('Test error')
      expect(result).toEqual({
        error: 'Test error'
      })
    })

    it('should create error response with message and code', () => {
      const result = createErrorResponse('Test error', 'TEST_CODE')
      expect(result).toEqual({
        error: 'Test error',
        code: 'TEST_CODE'
      })
    })

    it('should not include code property when code is undefined', () => {
      const result = createErrorResponse('Test error', undefined)
      expect(result).toEqual({
        error: 'Test error'
      })
      expect(result).not.toHaveProperty('code')
    })

    it('should not include code property when code is empty string', () => {
      const result = createErrorResponse('Test error', '')
      expect(result).toEqual({
        error: 'Test error'
      })
      expect(result).not.toHaveProperty('code')
    })
  })

  describe('handleValidationError', () => {
    it('should return BAD_REQUEST status for general validation errors', () => {
      const validationError = {
        field: 'valor',
        message: 'Invalid value',
        code: 'INVALID_TYPE'
      }

      const result = handleValidationError(validationError)

      expect(result).toEqual({
        status: HTTP_STATUS.BAD_REQUEST,
        response: {
          error: 'Invalid value',
          code: 'INVALID_TYPE'
        }
      })
    })

    it('should return UNPROCESSABLE_ENTITY status for IMPOSSIBLE_AMOUNT error', () => {
      const validationError = {
        field: 'valor',
        message: 'Cannot dispense this amount',
        code: 'IMPOSSIBLE_AMOUNT'
      }

      const result = handleValidationError(validationError)

      expect(result).toEqual({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        response: {
          error: 'Cannot dispense this amount',
          code: 'IMPOSSIBLE_AMOUNT'
        }
      })
    })

    it('should handle validation errors without codes', () => {
      const validationError = {
        field: 'valor',
        message: 'Generic error',
        code: 'GENERIC'
      }

      const result = handleValidationError(validationError)

      expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST)
      expect(result.response.error).toBe('Generic error')
      expect(result.response.code).toBe('GENERIC')
    })
  })

  describe('handleInternalError', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    it('should return INTERNAL_SERVER_ERROR status and log error', () => {
      const error = new Error('Something went wrong')
      const result = handleInternalError(error)

      expect(result).toEqual({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        response: {
          error: 'Erro interno do servidor. Tente novamente mais tarde.',
          code: ERROR_CODES.INTERNAL_ERROR
        }
      })

      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', error)
    })

    it('should handle string errors', () => {
      const error = 'String error'
      const result = handleInternalError(error)

      expect(result.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      expect(result.response.error).toBe('Erro interno do servidor. Tente novamente mais tarde.')
      expect(result.response.code).toBe(ERROR_CODES.INTERNAL_ERROR)

      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', error)
    })

    it('should handle unknown error types', () => {
      const error = { unknown: 'error' }
      const result = handleInternalError(error)

      expect(result.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      expect(result.response.error).toBe('Erro interno do servidor. Tente novamente mais tarde.')
      expect(result.response.code).toBe(ERROR_CODES.INTERNAL_ERROR)

      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', error)
    })

    it('should handle null errors', () => {
      const result = handleInternalError(null)

      expect(result.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      expect(result.response.error).toBe('Erro interno do servidor. Tente novamente mais tarde.')
      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', null)
    })
  })

  describe('handleInvalidRequest', () => {
    it('should return BAD_REQUEST status with standard message', () => {
      const result = handleInvalidRequest()

      expect(result).toEqual({
        status: HTTP_STATUS.BAD_REQUEST,
        response: {
          error: 'Formato de requisição inválido. Esperado: {"valor": number}',
          code: ERROR_CODES.INVALID_REQUEST
        }
      })
    })

    it('should always return same response regardless of calls', () => {
      const result1 = handleInvalidRequest()
      const result2 = handleInvalidRequest()

      expect(result1).toEqual(result2)
    })
  })

  describe('Constants', () => {
    it('should have correct ERROR_CODES values', () => {
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(ERROR_CODES.IMPOSSIBLE_WITHDRAWAL).toBe('IMPOSSIBLE_WITHDRAWAL')
      expect(ERROR_CODES.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
      expect(ERROR_CODES.INVALID_REQUEST).toBe('INVALID_REQUEST')
    })

    it('should have correct HTTP_STATUS values', () => {
      expect(HTTP_STATUS.OK).toBe(200)
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400)
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422)
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500)
    })
  })
})