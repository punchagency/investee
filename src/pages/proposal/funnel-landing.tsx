import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalFunnelLanding() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1 px-4 md:px-10">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/80 px-4 md:px-10 py-3">
              <Link href="/proposal" className="flex items-center gap-4 text-gray-900">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Investee</h2>
              </Link>
              <Link
                href="/proposal/auth"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0f49bd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign In</span>
              </Link>
            </header>

            {/* HeroSection */}
            <main className="flex-grow">
              <div className="py-16 sm:py-24 md:py-32">
                <div className="flex min-h-[480px] flex-col gap-8 items-center justify-center text-center p-4">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-tighter md:text-6xl">
                      See what real estate investors are doing in your area
                    </h1>
                    <h2 className="text-gray-600 text-lg font-normal leading-normal max-w-2xl mx-auto md:text-xl">
                      Unlock local market trends and discover investment opportunities powered by AI.
                    </h2>
                  </div>
                  <label className="flex flex-col min-w-40 h-16 w-full max-w-[480px] mt-4">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm">
                      <div className="text-gray-500 flex border border-gray-300 bg-white items-center justify-center pl-5 rounded-l-full border-r-0">
                        <span className="material-symbols-outlined text-xl">fmd_good</span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-gray-900 focus:outline-0 focus:ring-0 border border-gray-300 bg-white focus:border-[#0f49bd] h-full placeholder:text-gray-400 px-2 rounded-r-none border-r-0 rounded-l-none border-l-0 text-base font-normal leading-normal"
                        placeholder="Enter your Zip Code"
                      />
                      <div className="flex items-center justify-center rounded-r-full border-l-0 border border-gray-300 bg-white pr-2">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#0f49bd] text-white text-base font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Get Started</span>
                        </button>
                      </div>
                    </div>
                  </label>
                  <div className="flex flex-col sm:flex-row flex-1 gap-3 px-4 py-3 max-w-[480px] w-full justify-center">
                    <Link
                      href="/proposal/property-map"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#0f49bd]/20 text-[#0f49bd] text-base font-bold leading-normal tracking-[0.015em] grow"
                    >
                      <span className="truncate">Browse deals</span>
                    </Link>
                    <Link
                      href="/proposal/ai-assistant"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-gray-200 text-gray-800 text-base font-bold leading-normal tracking-[0.015em] grow"
                    >
                      <span className="truncate">Talk to AI</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Proof Section */}
              <div className="py-16 sm:py-24">
                <h4 className="text-gray-500 text-sm font-bold leading-normal tracking-widest uppercase px-4 py-2 text-center">
                  Trusted By Leading Firms
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 p-4 mt-8 items-center filter grayscale opacity-60">
                  <img className="mx-auto h-8" alt="Partner logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA71XWPFWx01sSEiUL-gG2HzMISwpqqGJGGBso-9PbvoJpVRdUjZinHUVaRxleQBYn0y7UBI27kbfTMPotmVo-17qJ6hYtfGvmUG_-hhEUDtuQbRDYcF0ueAoy887-4UsIJ4H0YLrxhrWOKTyhLJQ9OospDgh4C6Ayi4cISa02OWiujFjDGVdQxf6r6QJqOKyaHSPTdQ3CU7FJCBnVqdtdLCSb1geuweCxWNOi2MmUhB25nIII8fKqWrtiOrVTXr_RDS9lKdA8gZno" />
                  <img className="mx-auto h-8" alt="Partner logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS5dICdFfEmKfXDtCPTnmCt2CGMESk-UOc4JyB_dWXjc0kk9qzoAzlZUbtMCoyPIcaN-Xfe5ccPbcocliJZ-G4LT_i3E3AmYyQ47BJ-ppQjTy6SSydzT9CJ0fKO80wv76N_JC_9IQuj8qbm59Xdhsdv6ZIqPdj5qTq37tww2T9woyvZP7RcvcHxku2pOaeR0kl3937Xlza1YusF45_BkmGS7bGI_zJ2NSRmx8vP6y7e8nrnxkgu1zvqfQ6cs7TVjQG-z3NE005Tts" />
                  <img className="mx-auto h-8" alt="Partner logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdYotGk8L48JBBmEl9lM3CJpcmk8S7ZmKXwUkg4T6owJgF-gI0ijArdILXY0UXBCOCB0hxmegALVOWb7Jd6s-1ctqJSCVaMVL4FZlQNWv1WHNOHW_0C_8rKi7gNXWwFLhgDpQEu3bHcP2POjEGrVSkPFW-Gm-PxU07gktkLzcQLI3QDUUyY-lSOav-h7y7R1SW7ovOPChFASKBnavLbXegiQkTF5uNaBdDKAtv_WDfucc3PEbEHDduPcbTAZYUqLL8oyutxRkdB8s" />
                  <img className="mx-auto h-8" alt="Partner logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiYSkq5XK0eMZ8E6oIVPk3k7KaZlrafnOVxs4BN6XRQb6QIKHiyDJTqRYEvqtGyuN8eOjrmPYTDXPwebb0wLkMGGMtiS476j_ziMVvb-Hku2xrHDtGMCJ5CVJyVWD2CKZTZj9PsmuMKkSnTeBs_6kHH3ODANM-1Zl3V8HtWD55BCGerCQUAR0AKG3Ol465GC4czRDh7qn7GKCN-6Xk9C9xYm8b1wtOoGjA-UqJIBCSuaGn8oAg8TX-HNB31UjlWqPHMrfaspagxUk" />
                  <img className="mx-auto h-8" alt="Partner logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRU7PWn4iBndGnvxF4u0rw93PyNnQoiL7giwbm7MTzoupDITpor-8mcKu2t4j1HLewRNDKxvTxW8kD7Ga4oJ7JtE4QVAaQ_NW6KVMkJbMyBwSs6wIOqgiglv1CoqRKoDJa35sIwNgwgvc1k2c2SwyQgCB1uOXvNfiA7Z-7R8jMxDehor_TAfKMBTqxA20HKqALn6gjVSbqww9xNXLkLw0i_sHr4ZTKmSTm_b88w_hcB0TKROpC9LX_ibKQbRiu9MjHC1hUyeDUtfg" />
                </div>
              </div>

              {/* Value Proposition Section */}
              <div className="py-16 sm:py-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
                  A simple, powerful way to find and fund your next real estate investment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] mb-6">
                      <span className="material-symbols-outlined text-3xl">location_on</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Zip Code</h3>
                    <p className="text-gray-600">
                      Start by telling us where you want to invest. We'll instantly provide localized data and market insights.
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] mb-6">
                      <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze Deals with AI</h3>
                    <p className="text-gray-600">
                      Our AI assistant evaluates properties, predicts returns, and helps you make data-driven decisions.
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] mb-6">
                      <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with Capital</h3>
                    <p className="text-gray-600">
                      Once you find the perfect deal, we help you access a network of lenders to secure funding quickly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Final CTA Section */}
              <div className="py-16 sm:py-24">
                <div className="flex flex-col gap-8 items-center justify-center text-center p-8 rounded-lg bg-gray-100">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                      Ready to find your next deal?
                    </h2>
                    <p className="text-gray-600 text-lg font-normal leading-normal max-w-2xl mx-auto md:text-xl">
                      Enter your zip code to get started with localized, AI-powered insights.
                    </p>
                  </div>
                  <label className="flex flex-col min-w-40 h-16 w-full max-w-[480px] mt-4">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm">
                      <div className="text-gray-500 flex border border-gray-300 bg-white items-center justify-center pl-5 rounded-l-full border-r-0">
                        <span className="material-symbols-outlined text-xl">fmd_good</span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-gray-900 focus:outline-0 focus:ring-0 border border-gray-300 bg-white focus:border-[#0f49bd] h-full placeholder:text-gray-400 px-2 rounded-r-none border-r-0 rounded-l-none border-l-0 text-base font-normal leading-normal"
                        placeholder="Enter your Zip Code"
                      />
                      <div className="flex items-center justify-center rounded-r-full border-l-0 border border-gray-300 bg-white pr-2">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#0f49bd] text-white text-base font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Get Started</span>
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200/80 mt-24 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 text-center md:text-left">
                <Link href="/proposal" className="flex items-center gap-4 text-gray-900">
                  <InvesteeLogo size={24} />
                  <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Investee</h2>
                </Link>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                  <a className="hover:text-[#0f49bd]" href="#">About Us</a>
                  <a className="hover:text-[#0f49bd]" href="#">Contact</a>
                  <a className="hover:text-[#0f49bd]" href="#">Privacy Policy</a>
                  <a className="hover:text-[#0f49bd]" href="#">Terms of Service</a>
                </nav>
                <p className="text-xs text-gray-500">© 2024 Investee. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
