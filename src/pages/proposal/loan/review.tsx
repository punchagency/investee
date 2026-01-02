import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function LoanReview() {
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
              <span className="text-gray-500">Documents</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Summary & Submit</span>
            </div>

            <main className="flex-grow px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Review & Submit</h1>
              <p className="text-gray-600 mb-8">Please review your application before submitting.</p>

              {/* Summary Cards */}
              <div className="space-y-4">
                {/* Property Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Property Details</h2>
                    <Link href="/proposal/loan/step-1" className="text-[#0f49bd] text-sm font-medium">Edit</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="text-gray-900">123 Main St, Austin, TX 78701</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Property Type</p>
                      <p className="text-gray-900">Single Family</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Purchase Price</p>
                      <p className="text-gray-900">$500,000</p>
                    </div>
                    <div>
                      <p className="text-gray-500">As-Is Value</p>
                      <p className="text-gray-900">$525,000</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Loan Details</h2>
                    <Link href="/proposal/loan/step-2" className="text-[#0f49bd] text-sm font-medium">Edit</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Loan Type</p>
                      <p className="text-gray-900">DSCR Loan</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Loan Amount</p>
                      <p className="text-gray-900">$400,000</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Loan Term</p>
                      <p className="text-gray-900">30 Year Fixed</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Est. Rate</p>
                      <p className="text-gray-900">7.25%</p>
                    </div>
                  </div>
                </div>

                {/* Borrower Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Borrower Information</h2>
                    <Link href="/proposal/loan/step-3" className="text-[#0f49bd] text-sm font-medium">Edit</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="text-gray-900">David Johnson</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-900">david@email.com</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Credit Score</p>
                      <p className="text-gray-900">760+ (Excellent)</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Annual Income</p>
                      <p className="text-gray-900">$150,000</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                    <Link href="/proposal/loan/step-4" className="text-[#0f49bd] text-sm font-medium">Edit</Link>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <span className="text-gray-900">4 of 4 required documents uploaded</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-600">
                    I certify that the information provided is accurate and complete. I authorize Investee to
                    verify the information and obtain credit reports as necessary for this application.
                  </span>
                </label>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <Link
                  href="/proposal/loan/step-4"
                  className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </Link>
                <Link
                  href="/proposal/loan-status"
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] transition-colors"
                >
                  Submit Application
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
