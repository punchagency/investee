import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalPropertyMap() {
  const properties = [
    { id: 1, address: "789 Pine St, Denver, CO", price: "$450,000", capRate: "6.5%", status: "Available" },
    { id: 2, address: "456 Oak Ave, Austin, TX", price: "$380,000", capRate: "7.1%", status: "Under Contract" },
    { id: 3, address: "123 Maple Dr, Miami, FL", price: "$620,000", capRate: "5.8%", status: "Available" },
  ];

  return (
    <ProposalLayout>
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1 flex items-center gap-2 h-12 px-4 rounded-lg border border-gray-300 bg-white">
            <span className="material-symbols-outlined text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search by city, zip code, or address..."
              className="flex-1 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-12 px-4 rounded-lg border border-gray-300 bg-white">
              <option>All Property Types</option>
              <option>Single Family</option>
              <option>Multi-Family</option>
              <option>Commercial</option>
            </select>
            <select className="h-12 px-4 rounded-lg border border-gray-300 bg-white">
              <option>Any Price</option>
              <option>Under $300k</option>
              <option>$300k - $500k</option>
              <option>$500k - $1M</option>
              <option>Over $1M</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Map */}
          <div className="h-[500px] bg-gray-100 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-[#0f49bd]/30">map</span>
                <p className="text-gray-500 mt-4">Interactive Map View</p>
                <p className="text-gray-400 text-sm">Showing 156 properties in this area</p>
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">156 Properties Found</h2>
              <select className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Cap Rate: High to Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/proposal/property/${property.id}`}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0f49bd] hover:shadow-md transition-all"
                >
                  <div
                    className="w-32 h-24 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxcW7ZHQwNzI57o9a9r3eSROg7wa7KR0mJS-_8oI_YCYCh4MPZmACiCXxGCGommjHHA1bISUac7RwZu1_tGIpjtsbhOwSuRLKvSoLarIBCsf7C1nHhMyPYFizM75bqOdTW9laP2-MX5seDn6PhatDVtMz69tHmLwlTmD9t0laXOhV93jm7GV6_9G2A8LyQhdYwqgky7yW3qW3OJz-Da7tsorbJZ9UntKNn9WXcxG77BoODVVcGDYNPW7lO9WlvgpRPO_wfIe5hrhQ")`,
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{property.address}</p>
                    <p className="text-xl font-bold text-gray-900">{property.price}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">Cap Rate: {property.capRate}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          property.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProposalLayout>
  );
}
