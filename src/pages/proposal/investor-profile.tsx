import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalInvestorProfile() {
  const profiles = [
    {
      icon: "apartment",
      title: "Buy & Hold Investor",
      description: "Looking for long-term rental properties to build passive income",
    },
    {
      icon: "construction",
      title: "Fix & Flip Investor",
      description: "Seeking undervalued properties to renovate and sell for profit",
    },
    {
      icon: "account_balance",
      title: "Commercial Investor",
      description: "Interested in commercial real estate opportunities",
    },
    {
      icon: "trending_up",
      title: "First-Time Investor",
      description: "New to real estate investing and looking to get started",
    },
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
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
              <div className="text-center mb-12">
                <h1 className="text-[#1A2A4D] text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4">
                  What type of investor are you?
                </h1>
                <p className="text-[#6B7A8F] text-base md:text-lg">
                  Help us personalize your experience by selecting your investment style.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {profiles.map((profile) => (
                  <Link
                    key={profile.title}
                    href="/proposal/onboarding"
                    className="flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-[#0f49bd] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="size-16 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] flex items-center justify-center group-hover:bg-[#0f49bd] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-3xl">{profile.icon}</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-gray-900 font-bold text-lg mb-2">{profile.title}</h3>
                      <p className="text-gray-600 text-sm">{profile.description}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/proposal/dashboard" className="text-[#0f49bd] text-sm font-medium hover:underline">
                  Skip for now
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
