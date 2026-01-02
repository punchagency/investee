import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalOnboarding() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-2xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/proposal" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
              <span className="text-sm text-gray-500">Step 1 of 3</span>
            </header>

            <main className="flex-grow flex flex-col px-4 py-8">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div className="bg-[#0f49bd] h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>

              <div className="mb-8">
                <h1 className="text-[#1A2A4D] text-2xl md:text-3xl font-bold leading-tight mb-2">
                  Let's get to know you better
                </h1>
                <p className="text-[#6B7A8F] text-base">
                  Tell us about your investment goals so we can personalize your experience.
                </p>
              </div>

              <form className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-gray-900 text-sm font-medium mb-2">
                    What's your primary investment goal?
                  </label>
                  <select className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                    <option>Generate passive income</option>
                    <option>Build long-term wealth</option>
                    <option>Quick returns through flipping</option>
                    <option>Diversify my portfolio</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 text-sm font-medium mb-2">
                    How much capital do you have to invest?
                  </label>
                  <select className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50">
                    <option>Under $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000 - $250,000</option>
                    <option>$250,000 - $500,000</option>
                    <option>Over $500,000</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 text-sm font-medium mb-2">
                    What markets are you interested in?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Austin, TX; Denver, CO"
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 text-sm font-medium mb-2">
                    What's your experience level?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Beginner", "Intermediate", "Expert"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center justify-center h-12 rounded-lg border border-gray-300 bg-white text-gray-900 cursor-pointer hover:border-[#0f49bd] hover:bg-[#0f49bd]/5 transition-colors has-[:checked]:border-[#0f49bd] has-[:checked]:bg-[#0f49bd]/10"
                      >
                        <input type="radio" name="experience" value={level} className="sr-only" />
                        <span className="text-sm font-medium">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>

              <div className="flex items-center justify-between mt-12">
                <Link
                  href="/proposal/profile-select"
                  className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </Link>
                <Link
                  href="/proposal/dashboard"
                  className="flex items-center justify-center rounded-full h-12 px-8 bg-[#0f49bd] text-white text-base font-bold hover:bg-[#0d3da0] transition-colors"
                >
                  Continue
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
