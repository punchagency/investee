import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { V2Layout } from "../V2Layout";

export default function V2LoanStep1() {
  const [, setLocation] = useLocation();

  // Parse URL params for pre-filled data
  const params = new URLSearchParams(window.location.search);
  const prefillAddress = params.get("address") || "";
  const prefillValue = params.get("value") || "";

  const [formData, setFormData] = useState({
    loanType: "DSCR",
    propertyType: "Single Family",
    address: prefillAddress,
    purchasePrice: prefillValue,
    estimatedValue: prefillValue,
  });

  // Load saved data from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("v2LoanApplication");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("v2LoanApplication", JSON.stringify(formData));
    setLocation("/v2/loan/step-2");
  };

  const loanTypes = [
    { value: "DSCR", label: "DSCR Loan", description: "For rental properties with income" },
    { value: "Fix & Flip", label: "Fix & Flip", description: "Short-term renovation loans" },
  ];

  const propertyTypes = [
    "Single Family",
    "Multi-Family (2-4 units)",
    "Multi-Family (5+ units)",
    "Condo",
    "Townhouse",
    "Commercial",
  ];

  return (
    <V2Layout variant="auth">
      <main className="flex-grow flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h1>
            <p className="text-gray-600">Tell us about the property you want to finance</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Loan Type</label>
              <div className="grid grid-cols-2 gap-3">
                {loanTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      formData.loanType === type.value
                        ? "border-[#0f49bd] bg-[#0f49bd]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="loanType"
                      value={type.value}
                      checked={formData.loanType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium text-gray-900">{type.label}</span>
                    <span className="text-xs text-gray-500 mt-1">{type.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Property Address */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Property Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Austin, TX 78701"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                required
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Purchase Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="500000"
                  className="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Estimated Value */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Estimated Current Value</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="550000"
                  className="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/v2/dashboard"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
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
