import { z } from "zod";

// --- Types ---
export interface Property {
  id: number;
  address: string;
  state: string;
  investmentType: "DSCR" | "Fix & Flip";
  purchasePrice: number;
  estRent?: number;
  estARV?: number;
  taxes: number;
  insurance: number;
  rehab: number;
  rehabType: string | null;
}

export interface Quote {
  propertyId: number;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  productType: string;
  estClosingCosts: number;
}

export interface DSCRResult {
  pAndI: number;
  monthlyDebt: number;
  dscr: number;
  status: "pass" | "fail";
}

export interface FixFlipResult {
  totalBasis: number;
  totalHolding: number;
  profit: number;
  roi: number;
  verdict: "strong" | "marginal" | "weak";
}

// --- Mock Data ---
const demoProperties: Property[] = [
  {
    id: 1,
    address: "1234 Market St, Philadelphia, PA",
    state: "PA",
    investmentType: "DSCR",
    purchasePrice: 350000,
    estRent: 3200,
    taxes: 350,
    insurance: 120,
    rehab: 0,
    rehabType: null,
  },
  {
    id: 2,
    address: "18 W Main St, Atlanta, GA",
    state: "GA",
    investmentType: "Fix & Flip",
    purchasePrice: 240000,
    estARV: 340000,
    rehab: 60000,
    taxes: 280,
    insurance: 100,
    rehabType: "Heavy",
  },
  {
    id: 3,
    address: "902 Brickell Ave, Miami, FL",
    state: "FL",
    investmentType: "DSCR",
    purchasePrice: 480000,
    estRent: 4200,
    taxes: 420,
    insurance: 150,
    rehab: 0,
    rehabType: null,
  },
  {
    id: 4,
    address: "4500 San Jacinto St, Dallas, TX",
    state: "TX",
    investmentType: "DSCR",
    purchasePrice: 290000,
    estRent: 2800,
    taxes: 400,
    insurance: 110,
    rehab: 15000,
    rehabType: "Cosmetic",
  },
  {
    id: 5,
    address: "77 Peachtree Pl, Atlanta, GA",
    state: "GA",
    investmentType: "Fix & Flip",
    purchasePrice: 180000,
    estARV: 290000,
    rehab: 55000,
    taxes: 220,
    insurance: 90,
    rehabType: "Heavy",
  },
  {
    id: 6,
    address: "2020 Liberty Ave, Pittsburgh, PA",
    state: "PA",
    investmentType: "Fix & Flip",
    purchasePrice: 120000,
    estARV: 210000,
    rehab: 45000,
    taxes: 150,
    insurance: 80,
    rehabType: "Cosmetic",
  }
];

const EXCLUDED_STATES = ["NV", "AZ", "UT", "OR"];

// --- Mock API Functions ---
// Simulate network delay with helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchProperties(filters: {
  investmentType?: string;
  state?: string;
  rehabType?: string;
}) {
  await delay(600);
  
  const { investmentType, state, rehabType } = filters;
  let results = demoProperties.filter((p) => !EXCLUDED_STATES.includes(p.state));

  if (investmentType) {
    results = results.filter((p) => p.investmentType === investmentType);
  }

  if (state && state !== "All") {
    results = results.filter((p) => p.state === state);
  }

  if (rehabType && investmentType === "Fix & Flip" && rehabType !== "All") {
    results = results.filter(
      (p) => !p.rehabType || p.rehabType === rehabType
    );
  }

  return results;
}

export async function calculateDSCR(data: {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  rent: number;
  taxes: number;
  insurance: number;
}) {
  await delay(400);
  const { loanAmount, interestRate, termYears, rent, taxes, insurance } = data;

  const monthlyRate = interestRate / 100 / 12;
  const n = termYears * 12;
  const pAndI =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);

  const monthlyDebt = pAndI + (taxes || 0) + (insurance || 0);
  const dscr = rent / monthlyDebt;

  return {
    pAndI: Math.round(pAndI),
    monthlyDebt: Math.round(monthlyDebt),
    dscr: Number(dscr.toFixed(2)),
    status: dscr >= 1.1 ? "pass" : "fail",
  } as DSCRResult;
}

export async function calculateFixFlip(data: {
  purchasePrice: number;
  rehabBudget: number;
  arv: number;
  holdingMonths: number;
  monthlyCosts: number;
}) {
  await delay(400);
  const { purchasePrice, rehabBudget, arv, holdingMonths, monthlyCosts } = data;

  const totalBasis = purchasePrice + rehabBudget;
  const totalHolding = (monthlyCosts || 0) * (holdingMonths || 6);
  const profit = arv - totalBasis - totalHolding;
  const roi = (profit / totalBasis) * 100;

  let verdict: "strong" | "marginal" | "weak" = "marginal";
  if (roi > 20) verdict = "strong";
  else if (roi < 10) verdict = "weak";

  return {
    totalBasis,
    totalHolding,
    profit,
    roi: Number(roi.toFixed(1)),
    verdict,
  } as FixFlipResult;
}

export async function generateQuote(data: {
  propertyId: number;
  investmentType: string;
  downPaymentPercent?: number;
}) {
  await delay(800);
  const { propertyId, investmentType, downPaymentPercent = 20 } = data;

  const property = demoProperties.find((p) => p.id === propertyId);
  if (!property) throw new Error("Property not found");

  const purchasePrice = property.purchasePrice;
  const loanAmount = purchasePrice * (1 - downPaymentPercent / 100);

  const isDSCR = investmentType === "DSCR";
  const rate = isDSCR ? 7.25 : 10.5; // Updated to slightly more realistic current rates
  const termYears = isDSCR ? 30 : 1;

  return {
    propertyId,
    loanAmount: Math.round(loanAmount),
    interestRate: rate,
    termYears,
    productType: isDSCR ? "DSCR Rental" : "Fix & Flip",
    estClosingCosts: Math.round(loanAmount * 0.03),
  } as Quote;
}

export async function submitApplication(data: any) {
  await delay(1200);
  return {
    status: "received",
    dealId: `DEAL-${Math.floor(Math.random() * 100000)}`,
    message: "Application received successfully"
  };
}
