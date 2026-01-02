import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function LoanBorrowerInfo() {
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
              </div>
            </header>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm px-4 py-4">
              <span className="text-gray-500">Loan Details</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Identity & Financials</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Documents</span>
            </div>

            <main className="flex-grow px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Identity & Financials</h1>
              <p className="text-gray-600 mb-8">Please provide your personal and financial information.</p>

              <form className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Email</label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Phone</label>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Financial Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Annual Income</label>
                        <input
                          type="text"
                          placeholder="$ e.g., 150,000"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Credit Score Range</label>
                        <select className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                          <option>760+ (Excellent)</option>
                          <option>700-759 (Good)</option>
                          <option>660-699 (Fair)</option>
                          <option>620-659 (Below Average)</option>
                          <option>Below 620</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Total Assets</label>
                        <input
                          type="text"
                          placeholder="$ e.g., 500,000"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Total Liabilities</label>
                        <input
                          type="text"
                          placeholder="$ e.g., 200,000"
                          className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/proposal/loan/step-2"
                    className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                  </Link>
                  <Link
                    href="/proposal/loan/step-4"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
                  >
                    Next: Documents
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
