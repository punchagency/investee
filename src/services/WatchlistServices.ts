import https from "./http";

// Get user's watchlist
export const getWatchlist = () => {
  return https.get("/watchlist");
};

// Add listing to watchlist
export const addToWatchlist = (listingId: string) => {
  return https.post("/watchlist", { listingId });
};

// Remove listing from watchlist
export const removeFromWatchlist = (listingId: string) => {
  return https.delete(`/watchlist/${listingId}`);
};

// Check if listing is in watchlist
export const checkWatchlist = (listingId: string) => {
  return https.get(`/watchlist/check/${listingId}`);
};
