import { Link } from "wouter";
import { ProposalLayout } from "./ProposalLayout";

export default function ProposalBookCall() {
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  return (
    <ProposalLayout variant="minimal">
      <main className="flex-grow flex flex-col items-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Consultation</h1>
            <p className="text-gray-600">
              Schedule a free consultation with one of our investment specialists.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Specialist Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6">
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2O-J-ZnwSZxrFUDRtYdGLjKSR63tFRdFIsNrhSLioAeaChH5IYkTxXyUliwdCZrMOwN-OwDiKktmW6Ojdi71pALbL6azi1F0jhfjrVzCm9hdGk5D6CdWG6yAR-vgIz_py3u-0Kutvfe8dm7YY1mhXbr___7fdyYvdH-cJeNB_3MnjVweL5VLTZdVh8xleLqVmcGa1o6CvPVqeWHgtn1OwmXwHNfT4SMxD-KD-bHJesR093iiX-vtqWx40BZylWOGJCtkZdWohK54")`,
                }}
              />
              <div>
                <p className="font-bold text-gray-900">Sarah Mitchell</p>
                <p className="text-sm text-gray-600">Senior Investment Advisor</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                  <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Select a Date</h3>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-gray-500 py-2">{day}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`py-2 rounded-lg ${
                      day === 15
                        ? "bg-[#0f49bd] text-white"
                        : day < 10
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={day < 10}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Select a Time</h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`py-3 rounded-lg border text-sm ${
                      time === "2:00 PM"
                        ? "border-[#0f49bd] bg-[#0f49bd]/5 text-[#0f49bd]"
                        : "border-gray-200 hover:border-[#0f49bd]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-900">Your Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
              />
              <textarea
                placeholder="What would you like to discuss?"
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 resize-none"
              />
            </div>

            <Link
              href="/proposal/dashboard"
              className="w-full flex items-center justify-center h-12 rounded-lg bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
            >
              <span className="material-symbols-outlined mr-2">calendar_today</span>
              Book Consultation
            </Link>
          </div>
        </div>
      </main>
    </ProposalLayout>
  );
}
