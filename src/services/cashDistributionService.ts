import { AVAILABLE_BILLS } from "@/core/constants/bills";
import { BillDistribution } from "@/core/types";

/**
 * Calculates the minimum number of bills needed for a withdrawal amount
 * 
 * @param amount - The withdrawal amount
 * @returns Bill distribution object with count for each denomination
 */
export function calculateCashDistribution(amount: number): BillDistribution {

  const distribution: BillDistribution = {};
  let remaining = amount;

  // Initialize distribution with all bills set to 0
  AVAILABLE_BILLS.forEach(bill => {
    distribution[bill.toString()] = 0;
  });

  for (const bill of AVAILABLE_BILLS) {
    if (remaining >= bill) {
      const count = Math.floor(remaining / bill);
      distribution[bill.toString()] = count;
      remaining -= count * bill;
    }
  }

  return distribution;
}