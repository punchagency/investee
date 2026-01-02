import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function LoanPropertyDetails() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-3xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/proposal" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/proposal/dashboard" className="px-4 py-2 rounded-lg bg-[#0f49bd] text-white text-sm font-medium">
                  Save & Exit
                </Link>
                <div className="w-10 h-10 rounded-full bg-[#0f49bd]/20" />
              </div>
            </header>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm px-4 py-4">
              <span className="text-gray-500">Borrower Info</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Property Details</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Loan Details</span>
            </div>

            <main className="flex-grow px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Property Details</h1>
              <p className="text-gray-600 mb-8">Please provide the details of the property you are financing.</p>

              <form className="space-y-8">
                {/* Property Address */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Property Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-700 font-medium mb-1 block">Street Address</label>
                      <input
                        type="text"
                        placeholder="Enter street address"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">State</label>
                        <input
                          type="text"
                          placeholder="Enter state"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 font-medium mb-1 block">ZIP Code</label>
                      <input
                        type="text"
                        placeholder="Enter ZIP code"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Property Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Property Type</label>
                        <select className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                          <option>Single Family</option>
                          <option>Multi-Family</option>
                          <option>Condo</option>
                          <option>Townhouse</option>
                          <option>Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Number of Units</label>
                        <input
                          type="text"
                          placeholder="e.g., 1"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Purchase Price</label>
                        <input
                          type="text"
                          placeholder="$ e.g., 500,000"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Estimated As-Is Value</label>
                        <input
                          type="text"
                          placeholder="$ e.g., 525,000"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/proposal/dashboard"
                    className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                  </Link>
                  <Link
                    href="/proposal/loan/step-2"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
                  >
                    Next: Loan Details
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>
                </div>
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
