import { AVAILABLE_BILLS } from "@/core/constants/bills";
import { BillDistribution } from "@/core/types";

/**
 * Calculates the minimum number of bills needed for a withdrawal amount
 * 
 * @param amount - The withdrawal amount
 * @returns Bill distribution object with count for each denomination
 * @throws Error if amount is negative, non-integer or cannot be composed
 */
export function calculateCashDistribution(amount: number): BillDistribution {

  const distribution: BillDistribution = {};
  // Initialize distribution with zeros
  AVAILABLE_BILLS.forEach(b => {
    distribution[b.toString()] = 0;
  });

  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative integer");
  }

  if (amount === 0) {
    return distribution;
  }

  // Dynamic programming approach to find min number of bills
  const coins = [...AVAILABLE_BILLS]; 
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  const prev: (number | null)[] = new Array(amount + 1).fill(null);

  dp[0] = 0;

  for (const coin of coins) {
    for (let v = coin; v <= amount; v++) {
      if (dp[v - coin] + 1 < dp[v]) {
        dp[v] = dp[v - coin] + 1;
        prev[v] = coin;
      }
    }
  }

  if (!isFinite(dp[amount])) {
    throw new Error("Impossible to compose amount with available bills");
  }

  // Reconstruct solution
  let remaining = amount;
  while (remaining > 0) {
    const used = prev[remaining];
    if (used == null) {
      throw new Error("Failed to reconstruct bill distribution");
    }
    distribution[used.toString()] = (distribution[used.toString()] || 0) + 1;
    remaining -= used;
  }

  return distribution;
}