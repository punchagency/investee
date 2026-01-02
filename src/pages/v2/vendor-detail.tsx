import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import type { Vendor } from "@/lib/schema";
import { getVendorById } from "@/services/VendorServices";

const categoryLabels: Record<string, string> = {
  contractor: "General Contractor",
  inspector: "Home Inspector",
  appraiser: "Appraiser",
  attorney: "Real Estate Attorney",
  title: "Title Company",
  insurance: "Insurance Agent",
  property_manager: "Property Manager",
  landscaping: "Landscaping",
  cleaning: "Cleaning Service",
  handyman: "Handyman",
  plumber: "Plumber",
  electrician: "Electrician",
  hvac: "HVAC",
  roofing: "Roofing",
  other: "Other",
};

const categoryIcons: Record<string, string> = {
  contractor: "construction",
  inspector: "search",
  appraiser: "assessment",
  attorney: "gavel",
  title: "description",
  insurance: "shield",
  property_manager: "apartment",
  landscaping: "grass",
  cleaning: "cleaning_services",
  handyman: "handyman",
  plumber: "plumbing",
  electrician: "electrical_services",
  hvac: "ac_unit",
  roofing: "roofing",
  other: "more_horiz",
};

export default function V2VendorDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: vendor,
    isLoading,
    error,
  } = useQuery<Vendor>({
    queryKey: [`vendor`, id],
    queryFn: async () => {
      const response = await getVendorById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const renderStars = (rating: string | null) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalf = numRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-xl ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalf
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            {i < fullStars
              ? "star"
              : i === fullStars && hasHalf
              ? "star_half"
              : "star"}
          </span>
        ))}
        <span className="text-lg font-bold text-gray-900 ml-2">
          {numRating.toFixed(1)}
        </span>
        {vendor?.reviewCount && (
          <span className="text-gray-500 ml-1">
            ({vendor.reviewCount} reviews)
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <V2Sidebar>
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
            progress_activity
          </span>
        </div>
      </V2Sidebar>
    );
  }

  if (error || !vendor) {
    return (
      <V2Sidebar>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-600 text-2xl">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Vendor Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/v2/vendors"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold"
          >
            Back to Vendors
          </Link>
        </div>
      </V2Sidebar>
    );
  }

  const specialties = (vendor.services as string[]) || [];
  const serviceAreas = (vendor.services as string[]) || [];

  return (
    <V2Sidebar>
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/v2/vendors"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm mb-4"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Vendors
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-br from-[#0f49bd] to-[#0f49bd]/70 relative">
            {vendor.verified && (
              <span className="absolute top-4 right-4 px-3 py-1.5 bg-white text-green-600 text-sm font-bold rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  verified
                </span>
                Verified Vendor
              </span>
            )}
          </div>
          <div className="p-6 -mt-12 relative">
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0f49bd] text-4xl">
                  {categoryIcons[vendor.category] || "business"}
                </span>
              </div>
              <div className="flex-1 min-w-0 pt-12">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {vendor.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] text-sm font-medium">
                    {categoryLabels[vendor.category] || vendor.category}
                  </span>
                </div>
                {vendor.city && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      location_on
                    </span>
                    {vendor.city}
                    {vendor.state && `, ${vendor.state}`}
                  </p>
                )}
                <div className="mt-2">{renderStars(String(vendor.rating))}</div>
              </div>
              <div className="flex gap-3">
                {vendor.phone && (
                  <a
                    href={`tel:${vendor.phone}`}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0f49bd] text-white hover:bg-[#0d3da0] transition-colors"
                  >
                    <span className="material-symbols-outlined">call</span>
                  </a>
                )}
                {vendor.email && (
                  <a
                    href={`mailto:${vendor.email}`}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <span className="material-symbols-outlined">mail</span>
                  </a>
                )}
                {vendor.website && (
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <span className="material-symbols-outlined">language</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {vendor.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">
                  {vendor.description}
                </p>
              </div>
            )}

            {/* Credentials */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Credentials
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      vendor.licensed ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        vendor.licensed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      badge
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Licensed
                  </span>
                  <span
                    className={`text-xs ${
                      vendor.licensed ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {vendor.licensed ? "Yes" : "Not specified"}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      vendor.insured ? "bg-blue-100" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        vendor.insured ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      shield
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Insured
                  </span>
                  <span
                    className={`text-xs ${
                      vendor.insured ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {vendor.insured ? "Yes" : "Not specified"}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      vendor.verified ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        vendor.verified ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Verified
                  </span>
                  <span
                    className={`text-xs ${
                      vendor.verified ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {vendor.verified ? "Yes" : "Pending"}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-purple-600">
                      schedule
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Experience
                  </span>
                  <span className="text-xs text-purple-600">
                    {vendor.createdAt
                      ? `${new Date(vendor.createdAt).getFullYear()} years`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            {specialties.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Specialties
                </h2>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas */}
            {serviceAreas.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Service Areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {serviceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                    >
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {vendor.name && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Person</p>
                      <p className="text-gray-900 font-medium">{vendor.name}</p>
                    </div>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#0f49bd]">
                        call
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-[#0f49bd] font-medium hover:underline"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">
                        mail
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-[#0f49bd] font-medium hover:underline break-all"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">
                        language
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f49bd] font-medium hover:underline break-all"
                      >
                        {vendor.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
                {vendor.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">
                        {vendor.address}
                        {vendor.city && `, ${vendor.city}`}
                        {vendor.state && `, ${vendor.state}`}
                        {vendor.zipCode && ` ${vendor.zipCode}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                {vendor.priceRange && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Price Range</span>
                    <span className="text-gray-900 font-bold">
                      {vendor.priceRange}
                    </span>
                  </div>
                )}
                {vendor.verified && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Verified</span>
                    <span className="text-gray-900 font-medium capitalize">
                      {vendor.verified}
                    </span>
                  </div>
                )}
                {vendor.createdAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Years in Business</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(vendor.createdAt).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Get Started</h3>
              <div className="space-y-3">
                {vendor.phone && (
                  <a
                    href={`tel:${vendor.phone}`}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] transition-colors"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Call Now
                  </a>
                )}
                {vendor.email && (
                  <a
                    href={`mailto:${vendor.email}`}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    <span className="material-symbols-outlined">mail</span>
                    Send Email
                  </a>
                )}
                <button className="flex items-center justify-center gap-2 w-full h-12 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                  Save Vendor
                </button>
              </div>
            </div>

            {/* Notes */}
            {vendor.description && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-yellow-600">
                    info
                  </span>
                  <h3 className="font-bold text-yellow-800">Notes</h3>
                </div>
                <p className="text-yellow-700 text-sm">{vendor.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </V2Sidebar>
  );
}
