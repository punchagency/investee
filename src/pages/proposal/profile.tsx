import { ProposalLayout } from "./ProposalLayout";

export default function ProposalProfile() {
  return (
    <ProposalLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-6 p-6 bg-white rounded-xl border border-gray-200 mb-6">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2O-J-ZnwSZxrFUDRtYdGLjKSR63tFRdFIsNrhSLioAeaChH5IYkTxXyUliwdCZrMOwN-OwDiKktmW6Ojdi71pALbL6azi1F0jhfjrVzCm9hdGk5D6CdWG6yAR-vgIz_py3u-0Kutvfe8dm7YY1mhXbr___7fdyYvdH-cJeNB_3MnjVweL5VLTZdVh8xleLqVmcGa1o6CvPVqeWHgtn1OwmXwHNfT4SMxD-KD-bHJesR093iiX-vtqWx40BZylWOGJCtkZdWohK54")`,
            }}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">David Johnson</h1>
            <p className="text-gray-600">david.johnson@email.com</p>
            <p className="text-gray-500 text-sm mt-1">Member since October 2023</p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
            Edit Profile
          </button>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900">$1,250,000</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm">Active Deals</p>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm">Avg. ROI</p>
            <p className="text-2xl font-bold text-gray-900">8.2%</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  value="David Johnson"
                  className="w-full h-10 px-3 mt-1 rounded-lg border border-gray-300 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value="david.johnson@email.com"
                  className="w-full h-10 px-3 mt-1 rounded-lg border border-gray-300 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  type="tel"
                  value="(555) 123-4567"
                  className="w-full h-10 px-3 mt-1 rounded-lg border border-gray-300 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Investor Type</label>
                <input
                  type="text"
                  value="Buy & Hold Investor"
                  className="w-full h-10 px-3 mt-1 rounded-lg border border-gray-300 bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Investment Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Preferred Markets</p>
                <p className="text-gray-600 text-sm">Austin, TX; Denver, CO; Miami, FL</p>
              </div>
              <button className="text-[#0f49bd] text-sm font-medium">Edit</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Investment Range</p>
                <p className="text-gray-600 text-sm">$100,000 - $500,000</p>
              </div>
              <button className="text-[#0f49bd] text-sm font-medium">Edit</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Property Types</p>
                <p className="text-gray-600 text-sm">Multifamily, Single Family</p>
              </div>
              <button className="text-[#0f49bd] text-sm font-medium">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </ProposalLayout>
  );
}
