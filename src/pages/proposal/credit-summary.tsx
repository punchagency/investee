import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalCreditSummary() {
  return (
    <ProposalLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Impact Summary</h1>
        <p className="text-gray-600 mb-8">
          Understanding how your credit score affects your loan options.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Score Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Credit Score</h2>
              <div className="text-center py-8">
                <div className="relative inline-block">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="12"
                      strokeDasharray="440"
                      strokeDashoffset="88"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-gray-900">752</span>
                    <span className="text-sm text-green-600">Excellent</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                Last updated: Oct 24, 2023
              </p>
            </div>
          </div>

          {/* Impact Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rate Impact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">How Your Score Affects Rates</h2>
              <div className="space-y-4">
                {[
                  { range: "760+", rate: "6.5%", status: "Best Rate", highlight: false },
                  { range: "720-759", rate: "6.75%", status: "Great Rate", highlight: true },
                  { range: "680-719", rate: "7.25%", status: "Good Rate", highlight: false },
                  { range: "640-679", rate: "7.75%", status: "Fair Rate", highlight: false },
                  { range: "Below 640", rate: "8.5%+", status: "Higher Rate", highlight: false },
                ].map((item) => (
                  <div
                    key={item.range}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.highlight ? "bg-[#0f49bd]/10 border border-[#0f49bd]" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{item.range}</span>
                    <span className="text-gray-600">{item.rate}</span>
                    <span className={`text-sm ${item.highlight ? "text-[#0f49bd] font-medium" : "text-gray-500"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tips to Improve Your Score</h2>
              <ul className="space-y-3">
                {[
                  { icon: "credit_card", tip: "Pay down credit card balances to below 30% utilization" },
                  { icon: "schedule", tip: "Make all payments on time, every time" },
                  { icon: "do_not_disturb", tip: "Avoid opening new credit accounts before applying" },
                  { icon: "fact_check", tip: "Check your credit report for errors and dispute any inaccuracies" },
                ].map((item) => (
                  <li key={item.tip} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0f49bd]">{item.icon}</span>
                    <span className="text-gray-600">{item.tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 bg-[#0f49bd]/5 rounded-xl text-center">
          <h3 className="font-bold text-gray-900 mb-2">Ready to Apply?</h3>
          <p className="text-gray-600 mb-4">
            Your excellent credit score qualifies you for our best rates!
          </p>
          <Link
            href="/proposal/loan/step-1"
            className="inline-flex px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium"
          >
            Start Loan Application
          </Link>
        </div>
      </div>
    </ProposalLayout>
  );
}
