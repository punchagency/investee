import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalWelcome() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/proposal" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
              <div className="flex flex-1 justify-end items-center gap-6">
                <div className="hidden md:flex items-center gap-8">
                  <a className="text-[#6B7A8F] text-sm font-medium leading-normal hover:text-[#1A2A4D] transition-colors" href="#">
                    Why Us?
                  </a>
                  <a className="text-[#6B7A8F] text-sm font-medium leading-normal hover:text-[#1A2A4D] transition-colors" href="#">
                    How it Works
                  </a>
                  <a className="text-[#6B7A8F] text-sm font-medium leading-normal hover:text-[#1A2A4D] transition-colors" href="#">
                    Contact
                  </a>
                </div>
                <Link
                  href="/proposal/auth"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-[#1A2A4D]/10 text-[#1A2A4D] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1A2A4D]/20 transition-all"
                >
                  <span className="truncate">Log In</span>
                </Link>
              </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
              <div className="flex flex-col gap-6 w-full max-w-2xl">
                <h1 className="text-[#1A2A4D] text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                  Smarter Investing Starts Here
                </h1>
                <h2 className="text-[#6B7A8F] text-base md:text-lg font-normal leading-relaxed max-w-xl mx-auto">
                  Simplify your real estate investment journey with our innovative and user-friendly platform.
                </h2>
              </div>
              <div className="flex flex-col items-center gap-4 mt-10">
                <Link
                  href="/proposal/auth"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#FF6B00] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="truncate">Create Free Account</span>
                </Link>
                <p className="text-[#6B7A8F] text-sm font-medium leading-normal pt-2">
                  Already have an account?{" "}
                  <Link className="font-bold text-[#FF6B00] hover:underline" href="/proposal/auth">
                    Log in
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
