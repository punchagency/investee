/**
 * DSCR (Debt Service Coverage Ratio) Calculator
 *
 * DSCR = Monthly Rental Income / Total Monthly Debt Service
 *
 * Where Total Debt Service = Mortgage (P&I) + Taxes + Insurance + HOA
 */

export interface DSCRInputs {
  monthlyRent: number;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number; // Annual interest rate as percentage (e.g., 7.5)
  loanTermYears: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA?: number;
}

export interface DSCRResult {
  dscr: number;
  status: 'excellent' | 'good' | 'poor';
  statusColor: 'green' | 'yellow' | 'red';
  monthlyMortgage: number;
  totalDebtService: number;
  loanAmount: number;
  qualifies: boolean;
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  message: string;
}

/**
 * Calculate monthly mortgage payment (Principal & Interest)
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param years - Loan term in years
 */
export function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  return principal * (numerator / denominator);
}

/**
 * Get DSCR status based on ratio value
 *
 * Green (Excellent): >= 1.25 - Strong cash flow, best rates
 * Yellow (Good): 1.10 - 1.24 - Meets lender requirements
 * Red (Poor): < 1.10 - Does not qualify for most lenders
 */
export function getDSCRStatus(dscr: number): {
  status: 'excellent' | 'good' | 'poor';
  color: 'green' | 'yellow' | 'red';
  message: string;
} {
  if (dscr >= 1.25) {
    return {
      status: 'excellent',
      color: 'green',
      message: 'Excellent! Strong cash flow. Qualifies for best rates.',
    };
  } else if (dscr >= 1.10) {
    return {
      status: 'good',
      color: 'yellow',
      message: 'Good. Meets standard lender requirements.',
    };
  } else if (dscr >= 1.0) {
    return {
      status: 'poor',
      color: 'red',
      message: 'Marginal. May qualify with some lenders at higher rates.',
    };
  } else {
    return {
      status: 'poor',
      color: 'red',
      message: 'Does not qualify. Expenses exceed rental income.',
    };
  }
}

/**
 * Calculate full DSCR analysis
 */
export function calculateDSCR(inputs: DSCRInputs): DSCRResult {
  const {
    monthlyRent,
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHOA = 0,
  } = inputs;

  // Calculate loan amount
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;

  // Calculate monthly mortgage (P&I)
  const monthlyMortgage = calculateMonthlyMortgage(
    loanAmount,
    interestRate,
    loanTermYears
  );

  // Calculate total monthly debt service
  const totalDebtService = monthlyMortgage + monthlyTaxes + monthlyInsurance + monthlyHOA;

  // Calculate DSCR
  const dscr = totalDebtService > 0 ? monthlyRent / totalDebtService : 0;

  // Get status
  const { status, color, message } = getDSCRStatus(dscr);

  // Calculate cash flow
  const monthlyNetCashFlow = monthlyRent - totalDebtService;
  const annualNetCashFlow = monthlyNetCashFlow * 12;

  return {
    dscr: Math.round(dscr * 100) / 100, // Round to 2 decimal places
    status,
    statusColor: color,
    monthlyMortgage: Math.round(monthlyMortgage),
    totalDebtService: Math.round(totalDebtService),
    loanAmount: Math.round(loanAmount),
    qualifies: dscr >= 1.0,
    monthlyNetCashFlow: Math.round(monthlyNetCashFlow),
    annualNetCashFlow: Math.round(annualNetCashFlow),
    message,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Estimate monthly property taxes based on purchase price
 * Default: 1.25% annual property tax rate
 */
export function estimateMonthlyTaxes(purchasePrice: number, annualTaxRate = 1.25): number {
  return Math.round((purchasePrice * (annualTaxRate / 100)) / 12);
}

/**
 * Estimate monthly insurance based on purchase price
 * Default: 0.5% annual insurance rate
 */
export function estimateMonthlyInsurance(purchasePrice: number, annualInsuranceRate = 0.5): number {
  return Math.round((purchasePrice * (annualInsuranceRate / 100)) / 12);
}

/**
 * Calculate loan-to-value ratio
 */
export function calculateLTV(loanAmount: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  return Math.round((loanAmount / propertyValue) * 100);
}

/**
 * Calculate cash-on-cash return
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  totalCashInvested: number
): number {
  if (totalCashInvested <= 0) return 0;
  return Math.round((annualCashFlow / totalCashInvested) * 100 * 100) / 100;
}

/**
 * Estimate monthly rent based on property value and characteristics
 * Uses the 1% rule as a baseline (1% of property value = monthly rent)
 * Adjusted based on property value tier:
 * - Lower value properties (<$300k) tend to have higher rent-to-value ratios
 * - Higher value properties (>$1M) tend to have lower rent-to-value ratios
 */
export function estimateMonthlyRent(
  propertyValue: number,
  options?: {
    beds?: number;
    sqft?: number;
    propertyType?: string;
  }
): number {
  if (propertyValue <= 0) return 0;

  // Base rent multiplier varies by property value tier
  // This creates more realistic variation in DSCR across properties
  let rentMultiplier: number;
  if (propertyValue < 300000) {
    rentMultiplier = 0.009; // 0.9% for lower-value properties
  } else if (propertyValue < 500000) {
    rentMultiplier = 0.0075; // 0.75% for mid-range
  } else if (propertyValue < 1000000) {
    rentMultiplier = 0.006; // 0.6% for higher-value
  } else if (propertyValue < 2000000) {
    rentMultiplier = 0.005; // 0.5% for luxury
  } else {
    rentMultiplier = 0.004; // 0.4% for ultra-luxury
  }

  // Adjust for property characteristics if provided
  if (options?.beds) {
    // Properties with more bedrooms can command slightly higher rents
    if (options.beds >= 4) {
      rentMultiplier *= 1.05;
    } else if (options.beds <= 2) {
      rentMultiplier *= 0.95;
    }
  }

  return Math.round(propertyValue * rentMultiplier);
}

/**
 * Quick DSCR calculation for property cards
 * Uses default assumptions: 25% down, 7.5% interest, 30-year term
 */
export interface QuickDSCRResult {
  dscr: number;
  status: 'excellent' | 'good' | 'poor';
  statusColor: 'green' | 'yellow' | 'red';
  estimatedRent: number;
  monthlyDebtService: number;
}

export function calculateQuickDSCR(
  propertyValue: number,
  options?: {
    estimatedRent?: number;
    downPaymentPercent?: number;
    interestRate?: number;
    loanTermYears?: number;
    beds?: number;
    sqft?: number;
    propertyType?: string;
  }
): QuickDSCRResult {
  const {
    downPaymentPercent = 25,
    interestRate = 7.5,
    loanTermYears = 30,
  } = options || {};

  // Calculate or use provided estimated rent
  const estimatedRent = options?.estimatedRent || estimateMonthlyRent(propertyValue, {
    beds: options?.beds,
    sqft: options?.sqft,
    propertyType: options?.propertyType,
  });

  // Calculate loan amount
  const loanAmount = propertyValue * (1 - downPaymentPercent / 100);

  // Calculate monthly mortgage (P&I)
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, interestRate, loanTermYears);

  // Estimate taxes and insurance
  const monthlyTaxes = estimateMonthlyTaxes(propertyValue);
  const monthlyInsurance = estimateMonthlyInsurance(propertyValue);

  // Total debt service
  const monthlyDebtService = monthlyMortgage + monthlyTaxes + monthlyInsurance;

  // Calculate DSCR
  const dscr = monthlyDebtService > 0 ? estimatedRent / monthlyDebtService : 0;
  const roundedDSCR = Math.round(dscr * 100) / 100;

  // Get status
  const { status, color } = getDSCRStatus(roundedDSCR);

  return {
    dscr: roundedDSCR,
    status,
    statusColor: color,
    estimatedRent,
    monthlyDebtService: Math.round(monthlyDebtService),
  };
}
