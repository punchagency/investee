import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    google: typeof google;
    googleMapsReady: boolean;
  }
}

// Extend types for Street View callback
type StreetViewPanoramaData = google.maps.StreetViewPanoramaData;
type StreetViewStatus = google.maps.StreetViewStatus;

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  showStreetView?: boolean;
  streetViewAddress?: string;
}

export function GoogleMap({
  center = { lat: 34.0522, lng: -118.2437 }, // Los Angeles default
  zoom = 12,
  markers = [],
  onMapClick,
  className = "",
  showStreetView = false,
  streetViewAddress,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const streetViewInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;

      if (onMapClick) {
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }

      setIsLoaded(true);
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
    }
  }, [center, zoom, onMapClick]);

  const initStreetView = useCallback(async () => {
    if (!streetViewRef.current || !window.google || !streetViewAddress) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ address: streetViewAddress });

      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        const streetViewService = new window.google.maps.StreetViewService();

        streetViewService.getPanorama(
          { location, radius: 100 },
          (data: StreetViewPanoramaData | null, status: StreetViewStatus) => {
            if (status === window.google.maps.StreetViewStatus.OK && data?.location?.latLng) {
              const panorama = new window.google.maps.StreetViewPanorama(
                streetViewRef.current!,
                {
                  position: data.location.latLng,
                  pov: { heading: 0, pitch: 0 },
                  zoom: 1,
                  addressControl: false,
                  linksControl: true,
                  panControl: true,
                  enableCloseButton: false,
                }
              );
              streetViewInstanceRef.current = panorama;
            } else {
              setError("Street View not available for this location");
            }
          }
        );
      }
    } catch (err) {
      setError("Failed to load Street View");
      console.error("Street View error:", err);
    }
  }, [streetViewAddress]);

  // Wait for Google Maps to be ready
  useEffect(() => {
    const checkAndInit = () => {
      if (window.googleMapsReady && window.google) {
        if (showStreetView && streetViewAddress) {
          initStreetView();
        } else {
          initMap();
        }
      }
    };

    if (window.googleMapsReady) {
      checkAndInit();
    } else {
      window.addEventListener("google-maps-ready", checkAndInit);
      return () => window.removeEventListener("google-maps-ready", checkAndInit);
    }
  }, [initMap, initStreetView, showStreetView, streetViewAddress]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current!,
        title: markerData.title,
        animation: window.google.maps.Animation.DROP,
      });

      if (markerData.info || markerData.onClick) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.info || markerData.title,
        });

        marker.addListener("click", () => {
          if (markerData.info) {
            infoWindow.open(mapInstanceRef.current!, marker);
          }
          markerData.onClick?.();
        });
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m.position));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers, isLoaded]);

  // Update center when it changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">error</span>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (showStreetView) {
    return (
      <div className={`relative ${className}`}>
        <div ref={streetViewRef} className="w-full h-full rounded-xl" />
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
              progress_activity
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
            progress_activity
          </span>
        </div>
      )}
    </div>
  );
}
