import https from "./http";

export const getFavorites = (sessionId: string) => {
  return https.get(`/favorites?sessionId=${sessionId}`);
};

export const checkIsFavorite = (propertyId: string, sessionId: string) => {
  return https.get<{ isFavorite: boolean }>(
    `/favorites/${propertyId}?sessionId=${sessionId}`
  );
};

export const addFavorite = (propertyId: string, sessionId: string) => {
  return https.post("/favorites", { propertyId, sessionId });
};

export const removeFavorite = (propertyId: string, sessionId: string) => {
  return https.delete(`/favorites/${propertyId}?sessionId=${sessionId}`);
};
