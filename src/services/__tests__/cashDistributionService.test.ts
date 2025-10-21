import { calculateCashDistribution } from '@/services/cashDistributionService'
import { BillDistribution } from '@/types'

describe('calculateCashDistribution', () => {
  describe('Valid cases', () => {
    it('should return empty distribution for amount 0', () => {
      const result = calculateCashDistribution(0)
      const expected: BillDistribution = {
        '100': 0,
        '50': 0,
        '20': 0,
        '10': 0,
        '5': 0,
        '2': 0
      }
      expect(result).toEqual(expected)
    })

    it('should distribute single bill correctly', () => {
      const result = calculateCashDistribution(100)
      expect(result['100']).toBe(1)
      expect(result['50']).toBe(0)
      expect(result['20']).toBe(0)
      expect(result['10']).toBe(0)
      expect(result['5']).toBe(0)
      expect(result['2']).toBe(0)
    })

    it('should distribute multiple bills correctly for 88', () => {
      const result = calculateCashDistribution(88)
      // 88 = 50 + 20 + 10 + 8 = 50 + 20 + 10 + 4*2 (optimal distribution)
      expect(result['100']).toBe(0)
      expect(result['50']).toBe(1)
      expect(result['20']).toBe(1)
      expect(result['10']).toBe(1)
      expect(result['5']).toBe(0)
      expect(result['2']).toBe(4) // 88 - 50 - 20 - 10 = 8 = 4*2
      
      // Verify the total
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(88)
    })

    it('should handle amount 6 correctly', () => {
      const result = calculateCashDistribution(6)
      expect(result['2']).toBe(3) // 6 = 3 * 2
      expect(result['5']).toBe(0)
      expect(result['10']).toBe(0)
      
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(6)
    })

    it('should handle large amounts correctly', () => {
      const result = calculateCashDistribution(372)
      expect(result['100']).toBe(3)
      expect(result['50']).toBe(1)
      expect(result['20']).toBe(1)
      expect(result['2']).toBe(1) // 372 = 300 + 50 + 20 + 2
      
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(372)
    })

    it('should use minimum number of bills', () => {
      const result = calculateCashDistribution(60)
      expect(result['50']).toBe(1)
      expect(result['10']).toBe(1)
      // Should not use 30 bills of 2
      
      const totalBills = Object.values(result).reduce((sum, count) => sum + count, 0)
      expect(totalBills).toBeLessThanOrEqual(6) // Much less than 30
    })
  })

  describe('Invalid cases', () => {
    it('should throw error for negative amounts', () => {
      expect(() => calculateCashDistribution(-10)).toThrow('Amount must be a non-negative integer')
    })

    it('should throw error for non-integer amounts', () => {
      expect(() => calculateCashDistribution(10.5)).toThrow('Amount must be a non-negative integer')
    })

    it('should throw error for impossible amounts like 1', () => {
      expect(() => calculateCashDistribution(1)).toThrow('Impossible to compose amount with available bills')
    })

    it('should throw error for impossible amounts like 3', () => {
      expect(() => calculateCashDistribution(3)).toThrow('Impossible to compose amount with available bills')
    })

    it('should handle amounts that can be composed', () => {
      // These amounts can actually be composed with available bills
      const result11 = calculateCashDistribution(11)
      expect(result11['5']).toBe(1)
      expect(result11['2']).toBe(3) // 11 = 5 + 6 = 5 + 3*2
      
      const result13 = calculateCashDistribution(13)
      expect(result13['5']).toBe(1)
      expect(result13['2']).toBe(4) // 13 = 5 + 8 = 5 + 4*2
    })
  })

  describe('Edge cases', () => {
    it('should handle amount 2 (minimum possible)', () => {
      const result = calculateCashDistribution(2)
      expect(result['2']).toBe(1)
      
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(2)
    })

    it('should handle amount 4', () => {
      const result = calculateCashDistribution(4)
      expect(result['2']).toBe(2)
      
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(4)
    })

    it('should handle amount 5', () => {
      const result = calculateCashDistribution(5)
      expect(result['5']).toBe(1)
      expect(result['2']).toBe(0)
      
      const total = Object.entries(result).reduce((sum, [bill, count]) => 
        sum + (parseInt(bill) * count), 0
      )
      expect(total).toBe(5)
    })
  })
})