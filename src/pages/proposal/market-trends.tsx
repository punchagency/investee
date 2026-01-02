import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalMarketTrends() {
  const hotProperties = [
    { address: "Denver Metro Area", price: "$485,000", change: "+12%" },
    { address: "Austin, TX", price: "$520,000", change: "+8%" },
    { address: "Phoenix, AZ", price: "$395,000", change: "+15%" },
  ];

  return (
    <ProposalLayout>
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          Unlock Smarter Real Estate Investments.
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore real-time market trends, identify top-performing zip codes, and discover high-return
          properties before anyone else.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <button className="px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium">
            Explore Trends
          </button>
          <button className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium">
            View Properties
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Median Property Value Trend</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-[#0f49bd]/30">show_chart</span>
              <p className="text-gray-500 mt-2">Interactive Chart</p>
              <p className="text-gray-400 text-sm">Market trends over last 12 months</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Market Forecast Sentiment</p>
            <p className="text-2xl font-bold text-green-600 mt-2">High</p>
            <p className="text-gray-500 text-sm mt-1">Strong buying opportunity</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">National Avg. Cap Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">12.8%</p>
            <p className="text-green-600 text-sm mt-1">+2.3% from last month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Top Investor Zip Codes</p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex justify-between"><span>78701 - Austin</span><span className="text-green-600">+18%</span></p>
              <p className="flex justify-between"><span>80202 - Denver</span><span className="text-green-600">+15%</span></p>
              <p className="flex justify-between"><span>33101 - Miami</span><span className="text-green-600">+12%</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Properties */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hot Properties This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotProperties.map((property) => (
            <Link
              key={property.address}
              href="/proposal/property/1"
              className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2GWFdhSt6_YX2mjVmsHRysku-0EUBshRIDVYK_gfpwSVFePP-6T4M1AlmHQvZtYJm-6qXp4tmlnPk-3c0sIx5zyz0SRBsRFGsuxS4aLbyagEugiGvw0niPYbqr_AXKJZf0eOqtHEDaEezgshlXdT-hJ2S3cReteMc-x-7ybzp4JZSxoXHb4pcdkvX6n8H19DtoyOu5FCun7y6qWjCfcbzmuLQTWISSuh5RG8EOKR2O9S5lEbapd3VxAtqtl8oI9SoByNI3CZZ2MU")`,
                }}
              />
              <div className="p-4">
                <p className="text-gray-900 font-medium">{property.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold">{property.price}</span>
                  <span className="text-green-600 text-sm font-medium">{property.change}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4">
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Invest with an Edge?</h2>
          <p className="text-gray-600 mb-6">
            Get AI-powered insights, personalized watchlists, and exclusive investment opportunities.
          </p>
          <Link
            href="/proposal/auth"
            className="inline-flex px-6 py-3 rounded-full bg-[#0f49bd] text-white font-medium"
          >
            Sign Up for Free
          </Link>
        </div>
      </div>
    </ProposalLayout>
  );
}
