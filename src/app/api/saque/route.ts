import { calculateCashDistribution } from "@/services/cashDistributionService";
import { NextRequest, NextResponse } from "next/server";

/**
 * 
 * Processes withdrawal requests and returns the minimum number of bills needed
 * 
 * Request body: { "valor": number }
 * Response: { "100": number, "50": number, "20": number, "10": number, "5": number, "2": number }
 */
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const result = calculateCashDistribution(requestBody.valor);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
