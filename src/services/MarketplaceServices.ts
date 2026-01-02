import https from "./http";

export interface Property {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  sqFt: number | null;
  beds: number | null;
  baths: number | null;
  attomMarketValue: number | null;
  attomBldgSize: number | null;
  attomBeds: number | null;
  attomBaths: number | null;
  attomYearBuilt: number | null;
  propertyType: string | null;
}

export interface Listing {
  id: string;
  propertyId: string;
  status: string;
  listPrice: number | null;
  description: string | null;
  property?: Property | null;
}

// Get all listings
export const getListings = () => {
  return https.get<Listing[]>("/listings");
};

// Get watchlist
export const getWatchlist = () => {
  return https.get<any[]>("/watchlist");
};

// Add to watchlist
export const addToWatchlist = (listingId: string) => {
  return https.post("/watchlist", { listingId });
};

// Remove from watchlist
export const removeFromWatchlist = (listingId: string) => {
  return https.delete(`/watchlist/${listingId}`);
};

// Submit an offer
export const submitOffer = (data: {
  listingId: string;
  offerAmount: number;
  message?: string;
}) => {
  return https.post("/offers", data);
};
