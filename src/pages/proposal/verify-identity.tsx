import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalVerifyIdentity() {
  const regions = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/proposal" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
            </header>

            <main className="flex-grow flex flex-col items-center px-4 py-12">
              <div className="w-full max-w-md">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="w-16 h-1 bg-gray-200 rounded" />
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div className="w-16 h-1 bg-gray-200 rounded" />
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
                  <p className="text-gray-600">
                    Select your country of residence to continue with verification.
                  </p>
                </div>

                {/* Region Selection */}
                <div className="space-y-3 mb-8">
                  {regions.map((region) => (
                    <label
                      key={region.code}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#0f49bd] has-[:checked]:border-[#0f49bd] has-[:checked]:bg-[#0f49bd]/5 transition-colors"
                    >
                      <input
                        type="radio"
                        name="region"
                        value={region.code}
                        className="sr-only"
                        defaultChecked={region.code === "US"}
                      />
                      <span className="text-2xl">{region.flag}</span>
                      <span className="flex-1 font-medium text-gray-900">{region.name}</span>
                      <span className="material-symbols-outlined text-[#0f49bd] opacity-0 has-[:checked]:opacity-100">
                        check_circle
                      </span>
                    </label>
                  ))}
                </div>

                {/* ID Type Selection */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-3">Select ID Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "badge", label: "Driver's License" },
                      { icon: "flight", label: "Passport" },
                      { icon: "credit_card", label: "State ID" },
                      { icon: "military_tech", label: "Military ID" },
                    ].map((id) => (
                      <label
                        key={id.label}
                        className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#0f49bd] has-[:checked]:border-[#0f49bd] has-[:checked]:bg-[#0f49bd]/5 transition-colors"
                      >
                        <input type="radio" name="idType" value={id.label} className="sr-only" />
                        <span className="material-symbols-outlined text-2xl text-[#0f49bd]">{id.icon}</span>
                        <span className="text-sm text-gray-700">{id.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info Notice */}
                <div className="p-4 bg-blue-50 rounded-lg mb-8">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600">info</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Why do we need this?</p>
                      <p>
                        Identity verification helps us comply with financial regulations and protect your account
                        from unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/proposal/dashboard"
                  className="w-full flex items-center justify-center h-12 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
                >
                  Continue to Verification
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Your information is encrypted and secure.{" "}
                  <a href="#" className="text-[#0f49bd] hover:underline">Learn more</a>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
