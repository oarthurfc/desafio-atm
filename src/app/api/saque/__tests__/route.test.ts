/**
 * Unit tests for API route components
 * Testing the integration of validation, service, and error handling
 */

import { calculateCashDistribution } from '@/services/cashDistributionService'
import { validateRequestBody } from '@/utils/validation'
import { handleValidationError, handleInvalidRequest, handleInternalError } from '@/utils/errorHandler'

describe('API Route Components Integration', () => {
  describe('Service and validation integration', () => {
    it('should validate and process valid requests correctly', () => {
      const requestBody = { valor: 100 }
      
      // Test validation passes
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).toBeNull()
      
      // Test service calculates distribution
      const distribution = calculateCashDistribution(requestBody.valor)
      expect(distribution['100']).toBe(1)
      expect(distribution['50']).toBe(0)
      
      // Verify total
      const total = Object.entries(distribution).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(100)
    })

    it('should handle complex distributions correctly', () => {
      const requestBody = { valor: 88 }
      
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).toBeNull()
      
      const distribution = calculateCashDistribution(requestBody.valor)
      
      // Verify total adds up correctly
      const total = Object.entries(distribution).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(88)
    })

    it('should validate and reject invalid types', () => {
      const requestBody = { valor: 'invalid' }
      
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).not.toBeNull()
      expect(validationResult?.code).toBe('INVALID_TYPE')
      expect(validationResult?.message).toBe('O valor deve ser um número')
    })

    it('should validate and reject impossible amounts', () => {
      const requestBody = { valor: 1 }
      
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).not.toBeNull()
      expect(validationResult?.code).toBe('IMPOSSIBLE_AMOUNT')
    })

    it('should validate and reject missing valor field', () => {
      const requestBody = { amount: 100 } // wrong field name
      
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).not.toBeNull()
      expect(validationResult?.code).toBe('MISSING_FIELD')
    })
  })

  describe('Error handling integration', () => {
    it('should handle validation errors with correct status codes', () => {
      const validationError = {
        field: 'valor',
        message: 'Value must be a number',
        code: 'INVALID_TYPE'
      }
      
      const errorResponse = handleValidationError(validationError)
      expect(errorResponse.status).toBe(400)
      expect(errorResponse.response.error).toBe('Value must be a number')
      expect(errorResponse.response.code).toBe('INVALID_TYPE')
    })

    it('should handle impossible amount errors with unprocessable entity status', () => {
      const validationError = {
        field: 'valor',
        message: 'Cannot dispense this amount',
        code: 'IMPOSSIBLE_AMOUNT'
      }
      
      const errorResponse = handleValidationError(validationError)
      expect(errorResponse.status).toBe(422)
      expect(errorResponse.response.error).toBe('Cannot dispense this amount')
      expect(errorResponse.response.code).toBe('IMPOSSIBLE_AMOUNT')
    })

    it('should handle invalid request format', () => {
      const errorResponse = handleInvalidRequest()
      expect(errorResponse.status).toBe(400)
      expect(errorResponse.response.code).toBe('INVALID_REQUEST')
    })

    it('should handle internal errors', () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const error = new Error('Service failure')
      const errorResponse = handleInternalError(error)
      expect(errorResponse.status).toBe(500)
      expect(errorResponse.response.code).toBe('INTERNAL_ERROR')
      
      // Verify console.error was called
      expect(consoleSpy).toHaveBeenCalledWith('Internal server error:', error)
      
      // Restore console.error
      consoleSpy.mockRestore()
    })
  })

  describe('Service error scenarios', () => {
    it('should throw error for amounts that cannot be composed by service', () => {
      expect(() => calculateCashDistribution(1)).toThrow('Impossible to compose amount with available bills')
      expect(() => calculateCashDistribution(3)).toThrow('Impossible to compose amount with available bills')
    })

    it('should throw error for invalid input types in service', () => {
      expect(() => calculateCashDistribution(-1)).toThrow('Amount must be a non-negative integer')
      expect(() => calculateCashDistribution(1.5)).toThrow('Amount must be a non-negative integer')
    })
  })

  describe('End-to-end scenarios', () => {
    it('should process a complete valid flow', () => {
      // Input validation
      const requestBody = { valor: 50 }
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).toBeNull()
      
      // Service processing
      const distribution = calculateCashDistribution(requestBody.valor)
      expect(distribution['50']).toBe(1)
      
      // Verify response structure has all bill denominations
      const keys = Object.keys(distribution).sort((a, b) => parseInt(b) - parseInt(a))
      expect(keys).toEqual(['100', '50', '20', '10', '5', '2'])
    })

    it('should process a complete invalid flow', () => {
      // Input validation fails
      const requestBody = { valor: -5 }
      const validationResult = validateRequestBody(requestBody)
      expect(validationResult).not.toBeNull()
      
      // Error handling
      const errorResponse = handleValidationError(validationResult!)
      expect(errorResponse.status).toBe(400)
      expect(errorResponse.response.code).toBe('NEGATIVE')
    })
  })
})