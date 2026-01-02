import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalLoanReview() {
  return (
    <ProposalLayout>
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600">
            Your loan application has been received. We'll review it and get back to you within 24-48 hours.
          </p>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Application Status</h2>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
              Under Review
            </span>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
            {[
              { step: "Application Submitted", status: "completed", date: "Oct 24, 2023" },
              { step: "Document Verification", status: "current", date: "In Progress" },
              { step: "Credit Review", status: "pending", date: "Pending" },
              { step: "Underwriting", status: "pending", date: "Pending" },
              { step: "Final Approval", status: "pending", date: "Pending" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-4 py-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    item.status === "completed"
                      ? "bg-green-500 text-white"
                      : item.status === "current"
                      ? "bg-[#0f49bd] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {item.status === "completed" ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.step}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Application Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Application ID</p>
              <p className="text-gray-900 font-medium">#INV-2023-10241</p>
            </div>
            <div>
              <p className="text-gray-500">Loan Type</p>
              <p className="text-gray-900 font-medium">DSCR Loan</p>
            </div>
            <div>
              <p className="text-gray-500">Property Address</p>
              <p className="text-gray-900 font-medium">123 Main St, Austin, TX</p>
            </div>
            <div>
              <p className="text-gray-500">Loan Amount</p>
              <p className="text-gray-900 font-medium">$400,000</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#0f49bd]/5 rounded-xl border border-[#0f49bd]/20 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0f49bd] text-lg">schedule</span>
              <span>Our team will review your application within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0f49bd] text-lg">mail</span>
              <span>You'll receive email updates on your application status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0f49bd] text-lg">phone</span>
              <span>A loan specialist may contact you for additional information</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/proposal/dashboard"
            className="px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/proposal/book-call"
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Schedule a Call
          </Link>
        </div>
      </div>
    </ProposalLayout>
  );
}
