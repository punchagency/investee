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

// --- ATTOM API Types ---
export interface AttomProperty {
  identifier: {
    obPropId: number;
    attomId: number;
    apn: string;
  };
  address: {
    oneLine: string;
    line1: string;
    locality: string;
    postal1: string;
    country: string;
  };
  location: {
    latitude: string;
    longitude: string;
  };
  building: {
    size: {
      universalsize: number;
    };
    rooms: {
      beds: number;
      bathstotal: number;
    };
  };
  summary: {
    propclass: string;
    yearbuilt: number;
  };
  avm: {
    amount: {
      value: number;
    };
  };
}

// --- Mock Data ---
// Mock ATTOM API Response
const mockAttomData: AttomProperty[] = [
  {
    identifier: { obPropId: 10001, attomId: 51294247, apn: "064443" },
    address: { oneLine: "1234 Market St, Philadelphia, PA 19107", line1: "1234 Market St", locality: "Philadelphia", postal1: "19107", country: "US" },
    location: { latitude: "39.9526", longitude: "-75.1652" },
    building: { size: { universalsize: 1800 }, rooms: { beds: 3, bathstotal: 2 } },
    summary: { propclass: "Residential", yearbuilt: 1950 },
    avm: { amount: { value: 350000 } }
  },
  {
    identifier: { obPropId: 10002, attomId: 51294248, apn: "064444" },
    address: { oneLine: "18 W Main St, Atlanta, GA 30303", line1: "18 W Main St", locality: "Atlanta", postal1: "30303", country: "US" },
    location: { latitude: "33.7490", longitude: "-84.3880" },
    building: { size: { universalsize: 1200 }, rooms: { beds: 2, bathstotal: 1 } },
    summary: { propclass: "Residential", yearbuilt: 1940 },
    avm: { amount: { value: 240000 } }
  },
  {
    identifier: { obPropId: 10003, attomId: 51294249, apn: "064445" },
    address: { oneLine: "902 Brickell Ave, Miami, FL 33131", line1: "902 Brickell Ave", locality: "Miami", postal1: "33131", country: "US" },
    location: { latitude: "25.7743", longitude: "-80.1937" },
    building: { size: { universalsize: 2500 }, rooms: { beds: 4, bathstotal: 3 } },
    summary: { propclass: "Condo", yearbuilt: 2010 },
    avm: { amount: { value: 480000 } }
  },
  {
    identifier: { obPropId: 10004, attomId: 51294250, apn: "064446" },
    address: { oneLine: "4500 San Jacinto St, Dallas, TX 75204", line1: "4500 San Jacinto St", locality: "Dallas", postal1: "75204", country: "US" },
    location: { latitude: "32.7767", longitude: "-96.7970" },
    building: { size: { universalsize: 1600 }, rooms: { beds: 3, bathstotal: 2 } },
    summary: { propclass: "Residential", yearbuilt: 1980 },
    avm: { amount: { value: 290000 } }
  }
];

const demoProperties: Property[] = [
  // ... mapped from attom data in search function ...
];

const EXCLUDED_STATES = ["NV", "AZ", "UT", "OR"];

// --- Mock API Functions ---
// Simulate network delay with helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock ATTOM API Call
export async function fetchAttomProperties(): Promise<AttomProperty[]> {
  await delay(800); // Simulate API call latency
  console.log("Connecting to ATTOM API (Mock)...");
  return mockAttomData;
}

export async function searchProperties(filters: {
  investmentType?: string;
  state?: string;
  rehabType?: string;
}) {
  await delay(600);
  
  // Fetch from "ATTOM" (mock)
  const attomData = await fetchAttomProperties();
  
  // Map ATTOM data to our app's Property type (Adapter Pattern)
  const mappedProperties: Property[] = attomData.map(attom => {
    // Determine investment type based on some logic or random for demo
    const isFixFlip = attom.summary.yearbuilt < 1960; 
    
    return {
      id: attom.identifier.obPropId,
      address: attom.address.oneLine,
      state: attom.address.postal1.substring(0, 2) === "19" ? "PA" : 
             attom.address.postal1.substring(0, 2) === "30" ? "GA" :
             attom.address.postal1.substring(0, 2) === "33" ? "FL" : "TX", // Simple mapping for demo
      investmentType: isFixFlip ? "Fix & Flip" : "DSCR",
      purchasePrice: attom.avm.amount.value,
      estRent: Math.round(attom.avm.amount.value * 0.008), // Rule of thumb
      estARV: isFixFlip ? Math.round(attom.avm.amount.value * 1.4) : undefined,
      taxes: Math.round(attom.avm.amount.value * 0.012 / 12),
      insurance: 100,
      rehab: isFixFlip ? 50000 : 0,
      rehabType: isFixFlip ? "Heavy" : null,
    };
  });

  let results = mappedProperties.filter((p) => !EXCLUDED_STATES.includes(p.state));

  const { investmentType, state, rehabType } = filters;
  
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
