import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalPropertyDetail() {
  return (
    <ProposalLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-4 mb-4">
        <Link href="/proposal/property-map" className="hover:text-[#0f49bd]">Properties</Link>
        <span>/</span>
        <span className="text-gray-900">123 Maple Street</span>
      </div>

      {/* Property Header */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVHrVZ56MN_Rmc7k5B59P6Tbsmuan9Z_Pbv-NVu9yZN0PLizak2BQbFhHMxsXgSsp8WCxctsmCVDgJNs1t8k2rt3n3-ZmJ7llp6fCUPIN95k62uXVV9PsUwzc6969utzsbZWrtXqWcO2Ts9xOaq2MCgORL7pA9HXOi0-BCFq7PlUuBfmj195wbsh9Ka2YA83TYlLINhfFMXTCzGOkstPunVy1RDuJ7tlZMb9ScXHv2vY3iUYc-gJL7gfJB1LNBHJ118M_EnDJ6dNA"
          alt="Property"
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <p className="text-white/80 text-sm">123 Maple Street, Anytown, USA</p>
          <h1 className="text-white text-3xl font-bold">$750,000</h1>
          <p className="text-white/80 text-sm">4 bed / 3 bath / 2,500 sqft / Single Family</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Key Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Cap Rate</p>
                <p className="text-xl font-bold text-gray-900">6.2%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Cash on Cash</p>
                <p className="text-xl font-bold text-gray-900">14.6%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gross Yield</p>
                <p className="text-xl font-bold text-gray-900">8.1%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Appreciation (5yr)</p>
                <p className="text-xl font-bold text-green-600">5.5%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Vacancy Rate</p>
                <p className="text-xl font-bold text-gray-900">98%</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Crime Index</p>
                <p className="text-xl font-bold text-gray-900">75</p>
              </div>
            </div>
          </div>

          {/* Comparative Economics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Comparative Economics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">With Credit Improvement</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est Operating Costs</span>
                    <span className="font-medium">$48,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Operating Income</span>
                    <span className="font-medium">$52,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Rent</span>
                    <span className="font-medium">$2,800</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Without</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est Operating Costs</span>
                    <span className="font-medium">$45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Operating Income</span>
                    <span className="font-medium">$45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Rent</span>
                    <span className="font-medium">$2,400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Property Details</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to this stunning single-family home located in a highly desirable, family-friendly
              neighborhood. This spacious 4-bedroom, 3-bathroom residence spans 2,500 sqft of living space,
              featuring a modern kitchen with stainless steel appliances, granite countertops, and ample
              cabinet space. The open floor plan seamlessly connects the living, dining, and kitchen areas,
              making it perfect for entertaining.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">bed</span>
                <span>4 Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">bathtub</span>
                <span>3 Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">garage_home</span>
                <span>2 Car Garage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">square_foot</span>
                <span>2,500 sqft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mortgage Calculator */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mortgage Calculator</h2>
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">Estimated Monthly Payment</p>
              <p className="text-4xl font-bold text-gray-900">$3,792</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Principal & Interest</span>
                <span className="font-medium">$3,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Property Tax</span>
                <span className="font-medium">$392</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium">$200</span>
              </div>
            </div>
            <Link
              href="/proposal/loan/step-1"
              className="w-full mt-6 flex items-center justify-center h-12 rounded-lg bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
            >
              Apply for Financing
            </Link>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Schedule a Viewing</h2>
            <Link
              href="/proposal/book-call"
              className="w-full flex items-center justify-center h-12 rounded-lg border border-[#0f49bd] text-[#0f49bd] font-medium hover:bg-[#0f49bd]/5 transition-colors"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </ProposalLayout>
  );
}
