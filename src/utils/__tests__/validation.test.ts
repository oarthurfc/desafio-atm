import { validateWithdrawalAmount, validateRequestBody, VALIDATION_ERRORS } from '@/utils/validation'

describe('Validation utilities', () => {
  describe('validateWithdrawalAmount', () => {
    describe('Valid inputs', () => {
      it('should return null for valid positive integers', () => {
        expect(validateWithdrawalAmount(100)).toBeNull()
        expect(validateWithdrawalAmount(50)).toBeNull()
        expect(validateWithdrawalAmount(2)).toBeNull()
        expect(validateWithdrawalAmount(88)).toBeNull()
      })

      it('should return null for valid amounts that can be dispensed', () => {
        expect(validateWithdrawalAmount(4)).toBeNull()
        expect(validateWithdrawalAmount(5)).toBeNull()
        expect(validateWithdrawalAmount(6)).toBeNull()
        expect(validateWithdrawalAmount(7)).toBeNull()
        expect(validateWithdrawalAmount(8)).toBeNull()
      })
    })

    describe('Invalid inputs - missing/null values', () => {
      it('should return MISSING_FIELD error for undefined', () => {
        const result = validateWithdrawalAmount(undefined)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.MISSING_FIELD,
          code: 'MISSING_FIELD'
        })
      })

      it('should return MISSING_FIELD error for null', () => {
        const result = validateWithdrawalAmount(null)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.MISSING_FIELD,
          code: 'MISSING_FIELD'
        })
      })
    })

    describe('Invalid inputs - wrong types', () => {
      it('should return INVALID_TYPE error for strings', () => {
        const result = validateWithdrawalAmount('100')
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.INVALID_TYPE,
          code: 'INVALID_TYPE'
        })
      })

      it('should return INVALID_TYPE error for objects', () => {
        const result = validateWithdrawalAmount({ valor: 100 })
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.INVALID_TYPE,
          code: 'INVALID_TYPE'
        })
      })

      it('should return INVALID_TYPE error for arrays', () => {
        const result = validateWithdrawalAmount([100])
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.INVALID_TYPE,
          code: 'INVALID_TYPE'
        })
      })

      it('should return INVALID_TYPE error for booleans', () => {
        const result = validateWithdrawalAmount(true)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.INVALID_TYPE,
          code: 'INVALID_TYPE'
        })
      })
    })

    describe('Invalid inputs - non-integers', () => {
      it('should return NOT_INTEGER error for decimal numbers', () => {
        const result = validateWithdrawalAmount(10.5)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NOT_INTEGER,
          code: 'NOT_INTEGER'
        })
      })

      it('should return NOT_INTEGER error for NaN', () => {
        const result = validateWithdrawalAmount(NaN)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NOT_INTEGER,
          code: 'NOT_INTEGER'
        })
      })

      it('should return NOT_INTEGER error for Infinity', () => {
        const result = validateWithdrawalAmount(Infinity)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NOT_INTEGER,
          code: 'NOT_INTEGER'
        })
      })
    })

    describe('Invalid inputs - non-positive values', () => {
      it('should return ZERO error for zero', () => {
        const result = validateWithdrawalAmount(0)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.ZERO,
          code: 'ZERO'
        })
      })

      it('should return NEGATIVE error for negative numbers', () => {
        const result = validateWithdrawalAmount(-10)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NEGATIVE,
          code: 'NEGATIVE'
        })
      })

      it('should return NEGATIVE error for negative integers', () => {
        const result = validateWithdrawalAmount(-1)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NEGATIVE,
          code: 'NEGATIVE'
        })
      })
    })

    describe('Invalid inputs - impossible amounts', () => {
      it('should return IMPOSSIBLE_AMOUNT error for 1', () => {
        const result = validateWithdrawalAmount(1)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.IMPOSSIBLE_AMOUNT,
          code: 'IMPOSSIBLE_AMOUNT'
        })
      })

      it('should return IMPOSSIBLE_AMOUNT error for 3', () => {
        const result = validateWithdrawalAmount(3)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.IMPOSSIBLE_AMOUNT,
          code: 'IMPOSSIBLE_AMOUNT'
        })
      })
    })
  })

  describe('validateRequestBody', () => {
    describe('Valid request bodies', () => {
      it('should return null for valid request with number valor', () => {
        const body = { valor: 100 }
        expect(validateRequestBody(body)).toBeNull()
      })

      it('should return null for valid request with additional fields', () => {
        const body = { valor: 50, other: 'field' }
        expect(validateRequestBody(body)).toBeNull()
      })
    })

    describe('Invalid request bodies - structure', () => {
      it('should return INVALID_REQUEST error for null body', () => {
        const result = validateRequestBody(null)
        expect(result).toEqual({
          field: 'body',
          message: VALIDATION_ERRORS.INVALID_REQUEST,
          code: 'INVALID_REQUEST'
        })
      })

      it('should return INVALID_REQUEST error for undefined body', () => {
        const result = validateRequestBody(undefined)
        expect(result).toEqual({
          field: 'body',
          message: VALIDATION_ERRORS.INVALID_REQUEST,
          code: 'INVALID_REQUEST'
        })
      })

      it('should return INVALID_REQUEST error for string body', () => {
        const result = validateRequestBody('invalid')
        expect(result).toEqual({
          field: 'body',
          message: VALIDATION_ERRORS.INVALID_REQUEST,
          code: 'INVALID_REQUEST'
        })
      })

      it('should return INVALID_REQUEST error for number body', () => {
        const result = validateRequestBody(100)
        expect(result).toEqual({
          field: 'body',
          message: VALIDATION_ERRORS.INVALID_REQUEST,
          code: 'INVALID_REQUEST'
        })
      })

      it('should return MISSING_FIELD error for array body', () => {
        const result = validateRequestBody([])
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.MISSING_FIELD,
          code: 'MISSING_FIELD'
        })
      })
    })

    describe('Invalid request bodies - missing valor field', () => {
      it('should return MISSING_FIELD error for empty object', () => {
        const result = validateRequestBody({})
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.MISSING_FIELD,
          code: 'MISSING_FIELD'
        })
      })

      it('should return MISSING_FIELD error for object without valor', () => {
        const body = { amount: 100, value: 50 }
        const result = validateRequestBody(body)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.MISSING_FIELD,
          code: 'MISSING_FIELD'
        })
      })
    })

    describe('Invalid request bodies - invalid valor values', () => {
      it('should return validation error for invalid valor type', () => {
        const body = { valor: 'invalid' }
        const result = validateRequestBody(body)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.INVALID_TYPE,
          code: 'INVALID_TYPE'
        })
      })

      it('should return validation error for decimal valor', () => {
        const body = { valor: 10.5 }
        const result = validateRequestBody(body)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NOT_INTEGER,
          code: 'NOT_INTEGER'
        })
      })

      it('should return validation error for negative valor', () => {
        const body = { valor: -10 }
        const result = validateRequestBody(body)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.NEGATIVE,
          code: 'NEGATIVE'
        })
      })

      it('should return validation error for impossible valor', () => {
        const body = { valor: 1 }
        const result = validateRequestBody(body)
        expect(result).toEqual({
          field: 'valor',
          message: VALIDATION_ERRORS.IMPOSSIBLE_AMOUNT,
          code: 'IMPOSSIBLE_AMOUNT'
        })
      })
    })
  })
})