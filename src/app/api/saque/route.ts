import { calculateCashDistribution } from "@/services/cashDistributionService";
import { handleInvalidRequest, handleValidationError, HTTP_STATUS, handleInternalError } from "@/utils/errorHandler";
import { validateRequestBody } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

/**
 * 
 * Processes withdrawal requests and returns the minimum number of bills needed
 * 
 * @request body: { "valor": number }
 * @response : { "100": number, "50": number, "20": number, "10": number, "5": number, "2": number }
 */
export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      const { status, response } = handleInvalidRequest();
      return NextResponse.json(response, { status });
    }

    const validationError = validateRequestBody(requestBody);
    if (validationError) {
      const { status, response } = handleValidationError(validationError);
      return NextResponse.json(response, { status });
    }

    const result = calculateCashDistribution(requestBody.valor);

    return NextResponse.json(result, { status: HTTP_STATUS.OK });
    
  } catch (error) {
    const { status, response } = handleInternalError(error);
    return NextResponse.json(response, { status });
  }
}
