import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function LoanDocuments() {
  const documents = [
    { name: "Government-issued ID", description: "Driver's license or passport", required: true, uploaded: false },
    { name: "Bank Statements", description: "Last 3 months of statements", required: true, uploaded: false },
    { name: "Tax Returns", description: "Last 2 years of returns", required: true, uploaded: false },
    { name: "Proof of Income", description: "Pay stubs or W-2s", required: true, uploaded: false },
    { name: "Property Appraisal", description: "Recent property appraisal report", required: false, uploaded: false },
    { name: "Purchase Contract", description: "If applicable", required: false, uploaded: false },
  ];

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
              <span className="text-gray-500">Identity & Financials</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Upload Documents</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Review</span>
            </div>

            <main className="flex-grow px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
              <p className="text-gray-600 mb-8">Please upload the required documents to complete your application.</p>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-400">description</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {doc.name}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                      <span className="material-symbols-outlined text-lg">upload</span>
                      Upload
                    </button>
                  </div>
                ))}
              </div>

              {/* Drop Zone */}
              <div className="mt-6 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <span className="material-symbols-outlined text-4xl text-gray-400">cloud_upload</span>
                <p className="mt-2 text-gray-600">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <Link
                  href="/proposal/loan/step-3"
                  className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </Link>
                <Link
                  href="/proposal/loan/step-5"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
                >
                  Next: Review & Submit
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
