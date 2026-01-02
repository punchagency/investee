import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function LoanTerms() {
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
              <span className="text-gray-500">Property Details</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Loan Details</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Borrower Info</span>
            </div>

            <main className="flex-grow px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Loan Details</h1>
              <p className="text-gray-600 mb-8">Configure your preferred loan terms and rate options.</p>

              <form className="space-y-8">
                {/* Loan Type */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Loan Type</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#0f49bd] has-[:checked]:border-[#0f49bd] has-[:checked]:bg-[#0f49bd]/5 transition-colors">
                      <input type="radio" name="loanType" value="dscr" className="sr-only" defaultChecked />
                      <span className="material-symbols-outlined text-3xl text-[#0f49bd] mb-2">apartment</span>
                      <span className="font-medium text-gray-900">DSCR Loan</span>
                      <span className="text-sm text-gray-500">Investment property</span>
                    </label>
                    <label className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#0f49bd] has-[:checked]:border-[#0f49bd] has-[:checked]:bg-[#0f49bd]/5 transition-colors">
                      <input type="radio" name="loanType" value="fixflip" className="sr-only" />
                      <span className="material-symbols-outlined text-3xl text-[#0f49bd] mb-2">construction</span>
                      <span className="font-medium text-gray-900">Fix & Flip</span>
                      <span className="text-sm text-gray-500">Short-term renovation</span>
                    </label>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Loan Amount</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-700 font-medium mb-1 block">Requested Loan Amount</label>
                      <input
                        type="text"
                        placeholder="$ e.g., 400,000"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Loan Term</label>
                        <select className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                          <option>30 Year Fixed</option>
                          <option>15 Year Fixed</option>
                          <option>5/1 ARM</option>
                          <option>7/1 ARM</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium mb-1 block">Rate Type</label>
                        <select className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                          <option>Fixed Rate</option>
                          <option>Adjustable Rate</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Terms */}
                <div className="bg-[#0f49bd]/5 rounded-xl border border-[#0f49bd]/20 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Estimated Terms</h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-600 text-sm">Est. Interest Rate</p>
                      <p className="text-2xl font-bold text-gray-900">7.25%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Monthly Payment</p>
                      <p className="text-2xl font-bold text-gray-900">$2,730</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">LTV Ratio</p>
                      <p className="text-2xl font-bold text-gray-900">75%</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/proposal/loan/step-1"
                    className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                  </Link>
                  <Link
                    href="/proposal/loan/step-3"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
                  >
                    Next: Borrower Info
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
