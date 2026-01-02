import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalDashboard() {
  return (
    <ProposalLayout>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Welcome back, David
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
          <p className="text-gray-700 text-base font-medium leading-normal">Total Investment</p>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">$1,250,000</p>
          <p className="text-green-600 text-base font-medium leading-normal flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
            <span>2.5%</span>
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
          <p className="text-gray-700 text-base font-medium leading-normal">Portfolio Value</p>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">$1,480,000</p>
          <p className="text-green-600 text-base font-medium leading-normal flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
            <span>4.1%</span>
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
          <p className="text-gray-700 text-base font-medium leading-normal">Projected ROI</p>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">8.2%</p>
          <p className="text-green-600 text-base font-medium leading-normal flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
            <span>0.3%</span>
          </p>
        </div>
      </div>

      {/* Tracked Deals */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-4 pb-3 pt-5">
          <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">My Tracked Deals</h2>
          <Link href="/proposal/property-map" className="text-[#0f49bd] text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-4">
          <Link href="/proposal/property/1" className="flex flex-col gap-3 pb-3 group">
            <div
              className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxcW7ZHQwNzI57o9a9r3eSROg7wa7KR0mJS-_8oI_YCYCh4MPZmACiCXxGCGommjHHA1bISUac7RwZu1_tGIpjtsbhOwSuRLKvSoLarIBCsf7C1nHhMyPYFizM75bqOdTW9laP2-MX5seDn6PhatDVtMz69tHmLwlTmD9t0laXOhV93jm7GV6_9G2A8LyQhdYwqgky7yW3qW3OJz-Da7tsorbJZ9UntKNn9WXcxG77BoODVVcGDYNPW7lO9WlvgpRPO_wfIe5hrhQ")`,
              }}
            />
            <div className="px-1">
              <p className="text-gray-900 text-base font-medium leading-normal">789 Pine St, Denver, CO</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Cap Rate: 6.5%</p>
              <p className="text-blue-500 text-sm font-medium leading-normal">Under Review</p>
            </div>
          </Link>
          <Link href="/proposal/property/2" className="flex flex-col gap-3 pb-3 group">
            <div
              className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVHrVZ56MN_Rmc7k5B59P6Tbsmuan9Z_Pbv-NVu9yZN0PLizak2BQbFhHMxsXgSsp8WCxctsmCVDgJNs1t8k2rt3n3-ZmJ7llp6fCUPIN95k62uXVV9PsUwzc6969utzsbZWrtXqWcO2Ts9xOaq2MCgORL7pA9HXOi0-BCFq7PlUuBfmj195wbsh9Ka2YA83TYlLINhfFMXTCzGOkstPunVy1RDuJ7tlZMb9ScXHv2vY3iUYc-gJL7gfJB1LNBHJ118M_EnDJ6dNA")`,
              }}
            />
            <div className="px-1">
              <p className="text-gray-900 text-base font-medium leading-normal">456 Oak Ave, Austin, TX</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Cap Rate: 7.1%</p>
              <p className="text-green-500 text-sm font-medium leading-normal">Offer Sent</p>
            </div>
          </Link>
          <Link href="/proposal/property/3" className="flex flex-col gap-3 pb-3 group">
            <div
              className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2GWFdhSt6_YX2mjVmsHRysku-0EUBshRIDVYK_gfpwSVFePP-6T4M1AlmHQvZtYJm-6qXp4tmlnPk-3c0sIx5zyz0SRBsRFGsuxS4aLbyagEugiGvw0niPYbqr_AXKJZf0eOqtHEDaEezgshlXdT-hJ2S3cReteMc-x-7ybzp4JZSxoXHb4pcdkvX6n8H19DtoyOu5FCun7y6qWjCfcbzmuLQTWISSuh5RG8EOKR2O9S5lEbapd3VxAtqtl8oI9SoByNI3CZZ2MU")`,
              }}
            />
            <div className="px-1">
              <p className="text-gray-900 text-base font-medium leading-normal">123 Maple Dr, Miami, FL</p>
              <p className="text-gray-500 text-sm font-normal leading-normal">Cap Rate: 6.8%</p>
              <p className="text-gray-500 text-sm font-medium leading-normal">Watching</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Investment Tips */}
      <div className="flex flex-col gap-4">
        <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Investment Tips
        </h2>
        <div className="relative px-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-4 px-4">
            <div className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white w-80 flex-shrink-0 snap-center">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#0f49bd]/20 text-[#0f49bd] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <h3 className="text-gray-900 font-bold text-base">5 Ways to Analyze a Rental Property</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Learn the key metrics and strategies to evaluate potential rental investments for maximum return.
              </p>
              <a className="text-[#0f49bd] font-medium text-sm mt-auto" href="#">Read More</a>
            </div>
            <div className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white w-80 flex-shrink-0 snap-center">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#0f49bd]/20 text-[#0f49bd] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h3 className="text-gray-900 font-bold text-base">Understanding Market Trends</h3>
              </div>
              <p className="text-gray-600 text-sm">
                How to spot emerging markets and use data to predict future growth in real estate.
              </p>
              <a className="text-[#0f49bd] font-medium text-sm mt-auto" href="#">Read More</a>
            </div>
            <div className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white w-80 flex-shrink-0 snap-center">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#0f49bd]/20 text-[#0f49bd] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <h3 className="text-gray-900 font-bold text-base">Tax Benefits of Real Estate</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Discover the tax advantages that make real estate a powerful wealth-building tool.
              </p>
              <a className="text-[#0f49bd] font-medium text-sm mt-auto" href="#">Read More</a>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="flex flex-col gap-4">
        <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Smart Suggestions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div className="flex flex-col gap-4 p-6 rounded-xl border-2 border-dashed border-[#0f49bd]/50 bg-[#0f49bd]/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f49bd] text-xl">auto_awesome</span>
              <span className="text-[#0f49bd] text-sm font-bold">Recommended for You</span>
            </div>
            <p className="text-gray-900 text-base font-medium leading-normal">Riverside Lofts, Chicago, IL</p>
            <p className="text-gray-700 text-sm">
              Based on your interest in high-yield multifamily properties, this new listing offers a strong potential cash flow.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="/proposal/property/4"
                className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0f49bd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">View Deal</span>
              </Link>
              <button className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-white text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Dismiss</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-xl border-2 border-dashed border-[#0f49bd]/50 bg-[#0f49bd]/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f49bd] text-xl">auto_awesome</span>
              <span className="text-[#0f49bd] text-sm font-bold">Recommended for You</span>
            </div>
            <p className="text-gray-900 text-base font-medium leading-normal">Sunnyside Estates, Phoenix, AZ</p>
            <p className="text-gray-700 text-sm">
              This property aligns with your portfolio goals for long-term growth in up-and-coming neighborhoods.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="/proposal/property/5"
                className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0f49bd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">View Deal</span>
              </Link>
              <button className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-white text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProposalLayout>
  );
}
