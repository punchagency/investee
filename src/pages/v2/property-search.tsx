import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import { GoogleMap } from "@/components/google-map";
import { GooglePlacesAutocomplete } from "@/components/google-places-autocomplete";
import { searchProperty, type AttomPropertyData } from "@/services/attom";
import {
  checkIsFavorite,
  addFavorite,
  removeFavorite,
} from "@/services/FavoriteServices";

// Get or create a session ID for favorites
function getSessionId(): string {
  let sessionId = localStorage.getItem("investee_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("investee_session_id", sessionId);
  }
  return sessionId;
}

export default function V2PropertySearch() {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [property, setProperty] = useState<AttomPropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [propertyCoords, setPropertyCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  // Generate a property ID from the address for favorites
  const getPropertyId = (prop: AttomPropertyData) => {
    const fullAddress = `${prop.address.line1}, ${prop.address.locality}, ${prop.address.countrySubd} ${prop.address.postal1}`;
    return btoa(fullAddress)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32);
  };

  // Check if current property is favorited
  const { data: isFavorited } = useQuery({
    queryKey: [
      "favorites",
      property ? getPropertyId(property) : null,
      sessionId,
    ],
    queryFn: async () => {
      if (!property) return false;
      const propertyId = getPropertyId(property);
      const res = await checkIsFavorite(propertyId, sessionId);
      return res.data.isFavorite;
    },
    enabled: !!property,
  });

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await addFavorite(propertyId, sessionId);
      return res.data;
    },
    onSuccess: () => {
      if (property) {
        queryClient.invalidateQueries({
          queryKey: ["favorites", getPropertyId(property), sessionId],
        });
        queryClient.invalidateQueries({ queryKey: ["favorites", sessionId] });
      }
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await removeFavorite(propertyId, sessionId);
      return res.data;
    },
    onSuccess: () => {
      if (property) {
        queryClient.invalidateQueries({
          queryKey: ["favorites", getPropertyId(property), sessionId],
        });
        queryClient.invalidateQueries({ queryKey: ["favorites", sessionId] });
      }
    },
  });

  const toggleFavorite = () => {
    if (!property) return;
    const propertyId = getPropertyId(property);
    if (isFavorited) {
      removeFavoriteMutation.mutate(propertyId);
    } else {
      addFavoriteMutation.mutate(propertyId);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchProperty(address);
      setProperty(result);
      if (!result) {
        setError(
          "No property found at this address. Please check the address and try again."
        );
      }
    } catch (err) {
      setError("Failed to search for property. Please try again.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <V2Sidebar>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">
            Property Search
          </h1>
          <p className="text-gray-600 mt-1">
            Search any property address to get instant valuations and details
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                search
              </span>
              <GooglePlacesAutocomplete
                placeholder="Enter property address (e.g., 123 Main St, Austin, TX 78701)"
                defaultValue={address}
                onPlaceSelect={(place) => {
                  setAddress(place.address);
                  if (place.lat && place.lng) {
                    setPropertyCoords({ lat: place.lat, lng: place.lng });
                  }
                }}
                className="pl-12"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !address.trim()}
              className="h-12 px-6 rounded-xl bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Searching...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">search</span>
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600">
              error
            </span>
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Property Result */}
        {property && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#0f49bd]/5 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {property.address.line1}
                  </h2>
                  <p className="text-gray-600">
                    {property.address.locality}, {property.address.countrySubd}{" "}
                    {property.address.postal1}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFavorite}
                    disabled={
                      addFavoriteMutation.isPending ||
                      removeFavoriteMutation.isPending
                    }
                    className={`p-2 rounded-full transition-colors ${
                      isFavorited
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                    }`}
                    title={
                      isFavorited ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isFavorited ? "favorite" : "favorite_border"}
                    </span>
                  </button>
                  <span className="px-3 py-1 rounded-full bg-[#0f49bd]/10 text-[#0f49bd] text-sm font-medium">
                    {property.summary.propClass || "Residential"}
                  </span>
                </div>
              </div>
            </div>

            {/* Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b border-gray-200">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-gray-600 text-sm mb-1">Assessed Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {property.assessment.assessed.assdTotalValue
                    ? formatCurrency(
                        property.assessment.assessed.assdTotalValue
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0f49bd]/5">
                <p className="text-gray-600 text-sm mb-1">Market Value</p>
                <p className="text-2xl font-bold text-[#0f49bd]">
                  {property.assessment.market.mktTotalValue
                    ? formatCurrency(property.assessment.market.mktTotalValue)
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Property Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">
                      bed
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Bedrooms</p>
                    <p className="text-gray-900 font-bold">
                      {property.building.rooms.beds || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">
                      bathtub
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Bathrooms</p>
                    <p className="text-gray-900 font-bold">
                      {property.building.rooms.bathsTotal || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">
                      square_foot
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Sq Ft</p>
                    <p className="text-gray-900 font-bold">
                      {property.building.size.bldgSize
                        ? formatNumber(property.building.size.bldgSize)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">
                      calendar_today
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Year Built</p>
                    <p className="text-gray-900 font-bold">
                      {property.summary.yearBuilt || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale History */}
            {property.sale?.amount?.saleamt && (
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Last Sale
                </h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Sale Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(property.sale.amount.saleamt)}
                    </p>
                  </div>
                  {property.sale.saleTransDate && (
                    <div>
                      <p className="text-gray-600 text-sm">Sale Date</p>
                      <p className="text-xl font-bold text-gray-900">
                        {new Date(
                          property.sale.saleTransDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map Section */}
            {propertyCoords && (
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Location
                </h3>
                <GoogleMap
                  center={propertyCoords}
                  zoom={16}
                  markers={[
                    {
                      position: propertyCoords,
                      title: property.address.line1,
                      info: `<strong>${property.address.line1}</strong><br/>${property.address.locality}, ${property.address.countrySubd}`,
                    },
                  ]}
                  className="h-64 rounded-xl"
                />
              </div>
            )}

            {/* Actions */}
            <div className="p-6 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/v2/loan/step-1?address=${encodeURIComponent(
                  property.address.line1 +
                    ", " +
                    property.address.locality +
                    ", " +
                    property.address.countrySubd +
                    " " +
                    property.address.postal1
                )}&value=${
                  property.assessment.market.mktTotalValue ||
                  property.assessment.assessed.assdTotalValue ||
                  0
                }`}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] transition-colors"
              >
                <span className="material-symbols-outlined">description</span>
                Apply for Loan
              </Link>
              <button
                onClick={toggleFavorite}
                disabled={
                  addFavoriteMutation.isPending ||
                  removeFavoriteMutation.isPending
                }
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-full font-bold transition-colors ${
                  isFavorited
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="material-symbols-outlined">
                  {isFavorited ? "favorite" : "favorite_border"}
                </span>
                {isFavorited ? "Saved" : "Save Property"}
              </button>
              <button
                onClick={() => {
                  setAddress("");
                  setProperty(null);
                  setHasSearched(false);
                  setPropertyCoords(null);
                }}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
                New Search
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!property && !error && hasSearched && !isSearching && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-2xl">
                home
              </span>
            </div>
            <p className="text-gray-600">
              No property found. Try a different address.
            </p>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#0f49bd]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                search
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Search for a Property
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a property address above to get instant valuations, property
              details, and sale history powered by ATTOM data.
            </p>
          </div>
        )}
      </div>
    </V2Sidebar>
  );
}
