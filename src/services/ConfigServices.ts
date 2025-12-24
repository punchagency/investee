import https from "./http";

// Get Google Maps API key
export const getMapsApiKey = () => {
  return https.get("/config/maps");
};

// Get street view image
export const getStreetView = (address: string, size?: string) => {
  const params = new URLSearchParams({ address });
  if (size) {
    params.append("size", size);
  }
  return https.get(`/streetview?${params.toString()}`);
};
