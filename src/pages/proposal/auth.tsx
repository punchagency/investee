import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalAuth() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F5F7] p-4 sm:p-6 font-['Inter',sans-serif]"
    >
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          className="h-full w-full object-cover opacity-30 blur-sm"
          alt="A modern house with a pool at dusk"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUf1OrB6fGI4oBTmiL3DGJcovXfAKtIBTDbu64A74CCZCKCJxcaTe71dHGXZEq30XqpxvrvqIfdHEx80V9VWzMGV238v58Mmdl6Pr2pTQycB_LOaF2njw6aq5MwKcSRNxNMJRx6RC1R2Q3BMWGjWjbuTpNMqcSxij3iK93LAzGpccv75kxM2mHz2DigsBcgnzOazJuUuCeB1fQdCSnAS7ks1F4Kf9hBsQFAr3K4pmUWrizvZa_r01BG7C3MITv76sl5z4Rwozgqgs"
        />
        <div className="absolute inset-0 bg-[#F5F5F7]/30"></div>
      </div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link href="/proposal" className="mb-8 flex items-center gap-3">
          <InvesteeLogo size={32} />
          <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">Investee</h2>
        </Link>
        <div className="w-full rounded-lg bg-white/80 p-6 shadow-2xl shadow-gray-500/10 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-[#1D1D1F] tracking-tight text-[28px] font-bold leading-tight text-center pb-2">
              Log in to your account
            </h1>
            <p className="text-[#6E6E73] text-base font-normal leading-normal pb-6 text-center">
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="flex pb-6">
            <div className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#E8E8ED] p-1">
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 bg-white shadow-md shadow-gray-500/10 text-[#1D1D1F] text-sm font-medium leading-normal transition-colors duration-200">
                <span className="truncate">Log In</span>
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-[#6E6E73] text-sm font-medium leading-normal transition-colors duration-200">
                <span className="truncate">Sign Up</span>
              </label>
            </div>
          </div>
          <form className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[#1D1D1F] text-sm font-medium leading-normal pb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1D1D1F] focus:outline-0 focus:ring-2 focus:ring-[#007AFF]/50 border border-[#D2D2D7] bg-white/50 focus:border-[#007AFF] h-12 placeholder:text-[#6E6E73] p-3 text-base font-normal leading-normal transition-all"
                id="email"
                placeholder="Enter your email"
                type="email"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between pb-2">
                <label className="text-[#1D1D1F] text-sm font-medium leading-normal" htmlFor="password">
                  Password
                </label>
                <a className="text-sm font-medium text-[#007AFF] hover:underline" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1D1D1F] focus:outline-0 focus:ring-2 focus:ring-[#007AFF]/50 border border-[#D2D2D7] bg-white/50 focus:border-[#007AFF] h-12 placeholder:text-[#6E6E73] p-3 text-base font-normal leading-normal transition-all"
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6E6E73]"
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    visibility
                  </span>
                </button>
              </div>
            </div>
            <Link
              href="/proposal/dashboard"
              className="flex w-full items-center justify-center rounded-lg bg-[#007AFF] h-12 px-6 text-base font-medium text-white shadow-sm hover:bg-[#007AFF]/90 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 transition-colors"
            >
              Log In
            </Link>
          </form>
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-[#D2D2D7]"></div>
            <span className="mx-4 flex-shrink text-sm text-[#6E6E73]">OR</span>
            <div className="flex-grow border-t border-[#D2D2D7]"></div>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#D2D2D7] bg-white h-12 px-6 text-sm font-medium text-[#1D1D1F] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors">
              <img
                className="h-5 w-5"
                alt="Google logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS-Zn_HWx6nhRaR3_DtVuekGazMjZrps0w8a0qlKTrk-9HVdaHKEdmT8x95Z3P5gOIQdefeCC7oF1cke4Ah61WKDfuffC_HTSmaq_4RNiy2VFndKuQYhLB498gy93LT6-ys7Gtd82v28U-GLQPQUw90628HSUL44jT0KJLhYE6YNoMFKJrt2t6qihdSwUbMtX_crub5nS2NKtxyGdro_ALLYI40m8AZSCUI73cmkDfDXy-f62euI_h_6Mfrdm_yUMHCA3-YhoetFc"
              />
              Continue with Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#D2D2D7] bg-white h-12 px-6 text-sm font-medium text-[#1D1D1F] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors">
              <img
                className="h-5 w-5"
                alt="Apple logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAUehZc1Wx26JhH8Hmp_kSrBBHStz64BOeKmyHod__JEfnnfFkdjDhqr-cji2dJvDKLLjECaFhNIWgVCnFD9BqHBFpm2Mhc_89FRtgsJp2y9zrUkwfrt0UU9PQ2bgV6CFagy6mRGBoU7_sRRiQUWRFcqVle2m_HKOYevcDH4DrdkurIyrmFH-iejVzFj_D-Oa1ZJ8ABHMMXDG-Q-7JupesUNuDOFlf4hLMPS208TD-MY7Mmh7-ltdvzGZG55FfgpOH1DpoFg8j1fQ"
              />
              Continue with Apple
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4 text-center text-xs text-[#6E6E73]">
          <a className="hover:text-[#007AFF] hover:underline" href="#">
            Terms of Service
          </a>
          <a className="hover:text-[#007AFF] hover:underline" href="#">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
