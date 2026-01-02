import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { V2Layout } from "../V2Layout";

export default function V2LoanStep3() {
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    loanType: "",
    propertyType: "",
    address: "",
    purchasePrice: "",
    estimatedValue: "",
    downPayment: "",
    creditScore: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    preferredCallTime: "morning",
  });

  // Load saved data from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("v2LoanApplication");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({ ...prev, ...parsed }));
    } else {
      // Redirect to step 1 if no data
      setLocation("/v2/loan/step-1");
    }
  }, [setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("v2LoanApplication", JSON.stringify(formData));
    setLocation("/v2/loan/step-4");
  };

  return (
    <V2Layout variant="auth">
      <main className="flex-grow flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
              4
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h1>
            <p className="text-gray-600">Tell us how to contact you about your application</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
              />
            </div>

            {/* Preferred Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Preferred Contact Method</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "email", label: "Email", icon: "mail" },
                  { value: "phone", label: "Phone", icon: "phone" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      formData.preferredContact === method.value
                        ? "border-[#0f49bd] bg-[#0f49bd]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method.value}
                      checked={formData.preferredContact === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="material-symbols-outlined text-[#0f49bd]">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Best Time to Call */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Best Time to Reach You</label>
              <select
                name="preferredCallTime"
                value={formData.preferredCallTime}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
              >
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="evening">Evening (5pm - 8pm)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/v2/loan/step-2"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </Link>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>
    </V2Layout>
  );
}
