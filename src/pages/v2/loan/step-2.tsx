import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { V2Layout } from "../V2Layout";

export default function V2LoanStep2() {
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    loanType: "",
    propertyType: "",
    address: "",
    purchasePrice: "",
    estimatedValue: "",
    downPayment: "",
    creditScore: "720-739",
  });

  // Load saved data from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("v2LoanApplication");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({ ...prev, ...parsed }));
    } else {
      // Redirect to step 1 if no data
      setLocation("/v2/loan/step-1");
    }
  }, [setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("v2LoanApplication", JSON.stringify(formData));
    setLocation("/v2/loan/step-3");
  };

  const purchasePrice = parseInt(formData.purchasePrice) || 0;
  const downPayment = parseInt(formData.downPayment) || 0;
  const loanAmount = purchasePrice - downPayment;
  const ltv = purchasePrice > 0 ? ((loanAmount / purchasePrice) * 100).toFixed(1) : 0;

  const creditScoreRanges = [
    "800+",
    "780-799",
    "760-779",
    "740-759",
    "720-739",
    "700-719",
    "680-699",
    "660-679",
    "640-659",
    "620-639",
    "Below 620",
  ];

  return (
    <V2Layout variant="auth">
      <main className="flex-grow flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
              4
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan Terms</h1>
            <p className="text-gray-600">Configure your down payment and credit information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-[#0f49bd]">home</span>
                <span className="font-medium text-gray-900">{formData.address || "Property"}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{formData.loanType}</span>
                <span>•</span>
                <span>{formData.propertyType}</span>
                <span>•</span>
                <span>${parseInt(formData.purchasePrice).toLocaleString() || 0}</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Down Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleChange}
                  placeholder="100000"
                  className="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                  required
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">
                  {purchasePrice > 0 ? `${((downPayment / purchasePrice) * 100).toFixed(1)}% of purchase price` : ""}
                </span>
              </div>
            </div>

            {/* Loan Amount Summary */}
            <div className="p-4 rounded-xl bg-[#0f49bd]/5 border border-[#0f49bd]/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Loan Amount</span>
                <span className="text-xl font-bold text-[#0f49bd]">${loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Loan-to-Value (LTV)</span>
                <span className="font-medium text-gray-900">{ltv}%</span>
              </div>
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Credit Score Range</label>
              <select
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
              >
                {creditScoreRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Info Notice */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Rate Information</p>
                  <p>
                    Your actual rate will depend on your credit score, property type, and current market conditions.
                    A loan specialist will contact you with specific terms.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/v2/loan/step-1"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </Link>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>
    </V2Layout>
  );
}
