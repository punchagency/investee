import https from "./http";

// Create new listing
export const createListing = (data: any) => {
  return https.post("/listings", data);
};

// Get all marketplace listings
export const getAllListings = () => {
  return https.get("/listings");
};

// Get user's listings
export const getMyListings = () => {
  return https.get("/listings/my");
};

// Get listing by ID
export const getListingById = (id: string) => {
  return https.get(`/listings/${id}`);
};

// Update listing
export const updateListing = (id: string, data: any) => {
  return https.patch(`/listings/${id}`, data);
};

// Delete listing
export const deleteListing = (id: string) => {
  return https.delete(`/listings/${id}`);
};
