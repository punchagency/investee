import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Home, MapPin, DollarSign, TrendingUp, Calculator, Percent, Building2 } from "lucide-react";

interface Property {
  id: string;
  propertyType: string | null;
  address: string;
  city: string | null;
  state: string | null;
  sqFt: number | null;
  beds: number | null;
  baths: number | null;
  estValue: number | null;
  estEquity: number | null;
  owner: string | null;
  attomStatus: string | null;
  attomMarketValue: number | null;
  attomAssessedValue: number | null;
  attomYearBuilt: number | null;
  attomBldgSize: number | null;
  attomBeds: number | null;
  attomBaths: number | null;
  annualTaxes: number | null;
  annualInsurance: number | null;
  monthlyHoa: number | null;
}

interface DSCRAnalysis {
  monthlyRent: number;
  annualRent: number;
  monthlyDebt: number;
  annualDebt: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthlyExpenses: number;
  dscr: number;
  cashFlow: number;
}

interface FixFlipAnalysis {
  purchasePrice: number;
  rehabCost: number;
  holdingCosts: number;
  sellingCosts: number;
  afterRepairValue: number;
  totalInvestment: number;
  profit: number;
  roi: number;
}

export default function PropertyComparePage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const ids = params.get("ids")?.split(",") || [];
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(ids);
  
  const [dscrInputs, setDscrInputs] = useState<Record<string, { rent: number; loanAmount: number; rate: number; term: number; annualTaxes: number; annualInsurance: number; monthlyHoa: number }>>({});
  const [fixFlipInputs, setFixFlipInputs] = useState<Record<string, { rehabCost: number; holdingMonths: number; arvPercent: number }>>({});

  useEffect(() => {
    fetchAllProperties();
  }, []);

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchSelectedProperties();
    }
  }, [selectedIds]);

  async function fetchAllProperties() {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setAllProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSelectedProperties() {
    const fetchedProps: Property[] = [];
    for (const id of selectedIds) {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          fetchedProps.push(data);
          if (!dscrInputs[id]) {
            const value = data.attomMarketValue || data.estValue || 500000;
            setDscrInputs(prev => ({
              ...prev,
              [id]: { 
                rent: estimateRent(value), 
                loanAmount: value * 0.75, 
                rate: 7.5, 
                term: 30,
                annualTaxes: data.annualTaxes || Math.round(value * 0.0125),
                annualInsurance: data.annualInsurance || Math.round(value * 0.005),
                monthlyHoa: data.monthlyHoa || 0
              }
            }));
          }
          if (!fixFlipInputs[id]) {
            setFixFlipInputs(prev => ({
              ...prev,
              [id]: { rehabCost: 50000, holdingMonths: 6, arvPercent: 70 }
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    }
    setProperties(fetchedProps);
  }

  function estimateRent(propertyValue: number): number {
    return Math.round((propertyValue * 0.008) / 100) * 100;
  }

  function calculateDSCR(propId: string, propertyValue: number): DSCRAnalysis {
    const defaultInputs = { 
      rent: estimateRent(propertyValue), 
      loanAmount: propertyValue * 0.75, 
      rate: 7.5, 
      term: 30,
      annualTaxes: Math.round(propertyValue * 0.0125),
      annualInsurance: Math.round(propertyValue * 0.005),
      monthlyHoa: 0
    };
    const inputs = dscrInputs[propId] || defaultInputs;
    const monthlyRent = inputs.rent;
    const annualRent = monthlyRent * 12;
    const monthlyRate = inputs.rate / 100 / 12;
    const numPayments = inputs.term * 12;
    const monthlyDebt = inputs.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const annualDebt = monthlyDebt * 12;
    const monthlyTaxes = inputs.annualTaxes / 12;
    const monthlyInsurance = inputs.annualInsurance / 12;
    const monthlyHoa = inputs.monthlyHoa;
    const totalMonthlyExpenses = monthlyDebt + monthlyTaxes + monthlyInsurance + monthlyHoa;
    const dscr = annualRent / (annualDebt + inputs.annualTaxes + inputs.annualInsurance + (monthlyHoa * 12));
    const cashFlow = monthlyRent - totalMonthlyExpenses;
    return { monthlyRent, annualRent, monthlyDebt, annualDebt, monthlyTaxes, monthlyInsurance, monthlyHoa, totalMonthlyExpenses, dscr, cashFlow };
  }

  function calculateFixFlip(propId: string, propertyValue: number): FixFlipAnalysis {
    const inputs = fixFlipInputs[propId] || { rehabCost: 50000, holdingMonths: 6, arvPercent: 70 };
    const purchasePrice = propertyValue * (inputs.arvPercent / 100);
    const rehabCost = inputs.rehabCost;
    const holdingCosts = (purchasePrice * 0.01) * inputs.holdingMonths;
    const sellingCosts = propertyValue * 0.08;
    const afterRepairValue = propertyValue;
    const totalInvestment = purchasePrice + rehabCost + holdingCosts + sellingCosts;
    const profit = afterRepairValue - totalInvestment;
    const roi = (profit / totalInvestment) * 100;
    return { purchasePrice, rehabCost, holdingCosts, sellingCosts, afterRepairValue, totalInvestment, profit, roi };
  }

  function toggleProperty(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  }

  if (loading) {
    return (
      <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Property Comparison</h1>
        <p className="text-muted-foreground">Compare properties side by side with profitability analysis</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Select Properties to Compare (up to 3)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allProperties.map(p => (
              <Button
                key={p.id}
                variant={selectedIds.includes(p.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleProperty(p.id)}
                data-testid={`button-select-${p.id}`}
              >
                {p.address.substring(0, 30)}...
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Select properties above to compare</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className={`grid gap-6 ${properties.length === 1 ? 'md:grid-cols-1' : properties.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {properties.map(property => {
              const value = property.attomMarketValue || property.estValue || 0;
              const size = property.attomBldgSize || property.sqFt || 0;
              const beds = property.attomBeds || property.beds || 0;
              const baths = property.attomBaths || property.baths || 0;
              
              return (
                <Card key={property.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{property.address}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {property.city}, {property.state}
                        </p>
                      </div>
                      <Badge variant="secondary">{property.propertyType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-semibold text-primary">${value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-semibold">{size.toLocaleString()} sqft</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beds/Baths</p>
                        <p className="font-semibold">{beds} / {baths}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">$/sqft</p>
                        <p className="font-semibold">${size ? Math.round(value / size) : 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Year Built</p>
                        <p className="font-semibold">{property.attomYearBuilt || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Equity</p>
                        <p className="font-semibold text-green-600">${property.estEquity?.toLocaleString() || "—"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" /> DSCR Rental Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${properties.length === 1 ? 'md:grid-cols-1' : properties.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {properties.map(property => {
                  const value = property.attomMarketValue || property.estValue || 500000;
                  const defaultInputs = { 
                    rent: estimateRent(value), 
                    loanAmount: value * 0.75, 
                    rate: 7.5, 
                    term: 30,
                    annualTaxes: Math.round(value * 0.0125),
                    annualInsurance: Math.round(value * 0.005),
                    monthlyHoa: 0
                  };
                  const inputs = dscrInputs[property.id] || defaultInputs;
                  const analysis = calculateDSCR(property.id, value);
                  
                  return (
                    <div key={property.id} className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm">{property.address.substring(0, 25)}...</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Monthly Rent ($)</Label>
                          <Input
                            type="number"
                            value={inputs.rent}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, rent: Number(e.target.value) }
                            }))}
                            data-testid={`input-rent-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Loan Amount ($)</Label>
                          <Input
                            type="number"
                            value={inputs.loanAmount}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, loanAmount: Number(e.target.value) }
                            }))}
                            data-testid={`input-loan-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Interest Rate (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={inputs.rate}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, rate: Number(e.target.value) }
                            }))}
                            data-testid={`input-rate-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Term (years)</Label>
                          <Input
                            type="number"
                            value={inputs.term}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, term: Number(e.target.value) }
                            }))}
                            data-testid={`input-term-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Annual Taxes ($)</Label>
                          <Input
                            type="number"
                            value={inputs.annualTaxes}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, annualTaxes: Number(e.target.value) }
                            }))}
                            data-testid={`input-taxes-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Annual Insurance ($)</Label>
                          <Input
                            type="number"
                            value={inputs.annualInsurance}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, annualInsurance: Number(e.target.value) }
                            }))}
                            data-testid={`input-insurance-${property.id}`}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Monthly HOA ($)</Label>
                          <Input
                            type="number"
                            value={inputs.monthlyHoa}
                            onChange={(e) => setDscrInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, monthlyHoa: Number(e.target.value) }
                            }))}
                            data-testid={`input-hoa-${property.id}`}
                          />
                        </div>
                      </div>
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">DSCR</span>
                          <span className={`font-bold ${analysis.dscr >= 1.25 ? 'text-green-600' : analysis.dscr >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {analysis.dscr.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">P&I Payment</span>
                          <span className="font-semibold">${Math.round(analysis.monthlyDebt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Taxes + Ins + HOA</span>
                          <span className="font-semibold">${Math.round(analysis.monthlyTaxes + analysis.monthlyInsurance + analysis.monthlyHoa).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Monthly</span>
                          <span className="font-semibold">${Math.round(analysis.totalMonthlyExpenses).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">Monthly Cash Flow</span>
                          <span className={`font-bold ${analysis.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.round(analysis.cashFlow).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Fix & Flip Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${properties.length === 1 ? 'md:grid-cols-1' : properties.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {properties.map(property => {
                  const value = property.attomMarketValue || property.estValue || 500000;
                  const inputs = fixFlipInputs[property.id] || { rehabCost: 50000, holdingMonths: 6, arvPercent: 70 };
                  const analysis = calculateFixFlip(property.id, value);
                  
                  return (
                    <div key={property.id} className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm">{property.address.substring(0, 25)}...</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Purchase % of ARV</Label>
                          <Input
                            type="number"
                            value={inputs.arvPercent}
                            onChange={(e) => setFixFlipInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, arvPercent: Number(e.target.value) }
                            }))}
                            data-testid={`input-arv-${property.id}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Rehab Cost ($)</Label>
                          <Input
                            type="number"
                            value={inputs.rehabCost}
                            onChange={(e) => setFixFlipInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, rehabCost: Number(e.target.value) }
                            }))}
                            data-testid={`input-rehab-${property.id}`}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Holding Period (months)</Label>
                          <Input
                            type="number"
                            value={inputs.holdingMonths}
                            onChange={(e) => setFixFlipInputs(prev => ({
                              ...prev,
                              [property.id]: { ...inputs, holdingMonths: Number(e.target.value) }
                            }))}
                            data-testid={`input-holding-${property.id}`}
                          />
                        </div>
                      </div>
                      <div className="pt-3 border-t space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Purchase Price</span>
                          <span className="font-semibold">${Math.round(analysis.purchasePrice).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Investment</span>
                          <span className="font-semibold">${Math.round(analysis.totalInvestment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ARV (Sale Price)</span>
                          <span className="font-semibold">${Math.round(analysis.afterRepairValue).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Profit</span>
                          <span className={`font-bold ${analysis.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.round(analysis.profit).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ROI</span>
                          <span className={`font-bold ${analysis.roi >= 20 ? 'text-green-600' : analysis.roi >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {analysis.roi.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
