import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: typeof google;
    googleMapsReady: boolean;
  }
}

interface PlaceResult {
  address: string;
  streetNumber?: string;
  route?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  types?: string[];
  componentRestrictions?: { country: string | string[] };
}

export function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Enter address...",
  defaultValue = "",
  className = "",
  disabled = false,
  types = ["address"],
  componentRestrictions = { country: "us" },
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types,
        componentRestrictions,
        fields: ["address_components", "formatted_address", "geometry", "place_id"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.address_components) return;

        const result: PlaceResult = {
          address: place.formatted_address || "",
          placeId: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        };

        // Parse address components
        place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
          const types = component.types;

          if (types.includes("street_number")) {
            result.streetNumber = component.long_name;
          }
          if (types.includes("route")) {
            result.route = component.long_name;
          }
          if (types.includes("locality")) {
            result.city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            result.state = component.short_name;
          }
          if (types.includes("postal_code")) {
            result.zipCode = component.long_name;
          }
          if (types.includes("country")) {
            result.country = component.short_name;
          }
        });

        setValue(result.address);
        onPlaceSelect(result);
      });

      autocompleteRef.current = autocomplete;
      setIsLoaded(true);
    };

    if (window.googleMapsReady && window.google) {
      initAutocomplete();
    } else {
      const handleMapsReady = () => initAutocomplete();
      window.addEventListener("google-maps-ready", handleMapsReady);
      return () => window.removeEventListener("google-maps-ready", handleMapsReady);
    }
  }, [onPlaceSelect, types, componentRestrictions]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || !isLoaded}
        className={`w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="material-symbols-outlined animate-spin text-gray-400 text-xl">
            progress_activity
          </span>
        </div>
      )}
    </div>
  );
}

// Simple address search component that uses Places API for geocoding
interface AddressSearchProps {
  onSearch: (query: string, coords?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export function AddressSearch({
  onSearch,
  placeholder = "Search for properties...",
  className = "",
}: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      if (window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ address: query });

        if (result.results[0]) {
          const location = result.results[0].geometry.location;
          onSearch(query, { lat: location.lat(), lng: location.lng() });
        } else {
          onSearch(query);
        }
      } else {
        onSearch(query);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      onSearch(query);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
          search
        </span>
      </div>
      <button
        onClick={handleSearch}
        disabled={isLoading || !query.trim()}
        className="h-12 px-6 rounded-xl bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isLoading ? (
          <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-lg">search</span>
        )}
        Search
      </button>
    </div>
  );
}
