export interface BillDistribution {
  [key: string]: number;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}