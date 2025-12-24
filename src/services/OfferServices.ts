import https from "./http";

// Create new offer
export const createOffer = (data: {
  listingId: string;
  offerAmount: number;
  message?: string;
}) => {
  return https.post("/offers", data);
};

// Get user's offers
export const getMyOffers = () => {
  return https.get("/offers/my");
};

// Get all offers for a specific listing
export const getListingOffers = (listingId: string) => {
  return https.get(`/listings/${listingId}/offers`);
};

// Update offer
export const updateOffer = (id: string, data: any) => {
  return https.patch(`/offers/${id}`, data);
};
