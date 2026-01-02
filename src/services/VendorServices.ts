import https from "./http";

// Get all vendors
export const getAllVendors = () => {
  return https.get("/vendors");
};

// Create new vendor
export const createVendor = (data: any) => {
  return https.post("/vendors", data);
};

// Get vendor by ID
export const getVendorById = (id: string) => {
  return https.get(`/vendors/${id}`);
};

// Update vendor
export const updateVendor = (id: string, data: any) => {
  return https.patch(`/vendors/${id}`, data);
};

// Delete vendor
export const deleteVendor = (id: string) => {
  return https.delete(`/vendors/${id}`);
};
