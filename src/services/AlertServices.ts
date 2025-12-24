import https from "./http";

// Get all user's property alerts
export const getAllAlerts = () => {
  return https.get("/alerts");
};

// Create new property alert
export const createAlert = (data: any) => {
  return https.post("/alerts", data);
};

// Get alert by ID
export const getAlertById = (id: string) => {
  return https.get(`/alerts/${id}`);
};

// Update alert
export const updateAlert = (id: string, data: any) => {
  return https.patch(`/alerts/${id}`, data);
};

// Delete alert
export const deleteAlert = (id: string) => {
  return https.delete(`/alerts/${id}`);
};
