import { Link } from "wouter";
import { ProposalSidebar } from "./ProposalLayout";

export default function ProposalPropertyManagement() {
  const properties = [
    { id: 1, address: "789 Pine St, Denver, CO", price: "$450,000", status: "Active", views: 234, inquiries: 12 },
    { id: 2, address: "456 Oak Ave, Austin, TX", price: "$380,000", status: "Pending", views: 189, inquiries: 8 },
    { id: 3, address: "123 Maple Dr, Miami, FL", price: "$620,000", status: "Active", views: 312, inquiries: 18 },
    { id: 4, address: "555 Elm Blvd, Phoenix, AZ", price: "$295,000", status: "Sold", views: 456, inquiries: 24 },
  ];

  return (
    <ProposalSidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
            <p className="text-gray-600">Manage your property listings and track performance</p>
          </div>
          <button className="h-10 px-4 rounded-lg bg-[#0f49bd] text-white text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Property
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 rounded-full bg-[#0f49bd] text-white text-sm font-medium">All</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
            Active
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
            Pending
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
            Sold
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVHrVZ56MN_Rmc7k5B59P6Tbsmuan9Z_Pbv-NVu9yZN0PLizak2BQbFhHMxsXgSsp8WCxctsmCVDgJNs1t8k2rt3n3-ZmJ7llp6fCUPIN95k62uXVV9PsUwzc6969utzsbZWrtXqWcO2Ts9xOaq2MCgORL7pA9HXOi0-BCFq7PlUuBfmj195wbsh9Ka2YA83TYlLINhfFMXTCzGOkstPunVy1RDuJ7tlZMb9ScXHv2vY3iUYc-gJL7gfJB1LNBHJ118M_EnDJ6dNA")`,
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900">{property.price}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : property.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{property.address}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">visibility</span>
                    {property.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">mail</span>
                    {property.inquiries}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/proposal/property/${property.id}`}
                    className="flex-1 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                  >
                    View
                  </Link>
                  <button className="flex-1 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProposalSidebar>
  );
}
