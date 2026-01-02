import https from "./http";

export const getStreetViewImageUrl = (address: string, size?: string) => {
  let url = `/api/streetview?address=${encodeURIComponent(address)}`;
  if (size) url += `&size=${size}`;
  return url;
};

// Search property by address (ATTOM)
export const searchProperty = (address: string) => {
  return https.get(`/property/search?address=${encodeURIComponent(address)}`);
};

// Search properties within radius (ATTOM)
export const searchPropertyRadius = (
  lat: number,
  lng: number,
  radius?: number,
  filters?: {
    minbeds?: number;
    maxbeds?: number;
    propertytype?: string;
  }
) => {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
  });

  if (radius) params.append("radius", radius.toString());
  if (filters?.minbeds) params.append("minbeds", filters.minbeds.toString());
  if (filters?.maxbeds) params.append("maxbeds", filters.maxbeds.toString());
  if (filters?.propertytype)
    params.append("propertytype", filters.propertytype);

  return https.get(`/property/radius?${params.toString()}`);
};

// Get all properties
export const getAllProperties = () => {
  return https.get("/properties");
};

// Get property by ID
export const getPropertyById = (id: string) => {
  return https.get(`/properties/${id}`);
};

// Update property
export const updateProperty = (id: string, data: any) => {
  return https.put(`/properties/${id}`, data);
};

// Enrich property (ATTOM)
export const enrichProperty = (id: string) => {
  return https.post(`/properties/${id}/enrich`);
};

// Enrich property (RentCast)
export const enrichPropertyRentcast = (id: string) => {
  return https.post(`/properties/${id}/enrich-rentcast`);
};

// Get Maps Config
export const getMapsConfig = () => {
  return https.get("/config/maps");
};

// Import properties from Excel
export const importProperties = (filePath: string) => {
  return https.post("/properties/import", { filePath });
};

// Batch enrich properties with ATTOM data
export const enrichProperties = (force: boolean = false) => {
  return https.post("/properties/enrich", { force });
};

// Batch enrich properties with Rentcast data
export const enrichPropertiesRentcastBatch = () => {
  return https.post("/properties/enrich-rentcast-batch");
};
