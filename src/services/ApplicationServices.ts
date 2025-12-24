import https from "./http";

// Create new loan application
export const createApplication = (data: any) => {
  return https.post("/applications", data);
};

// Get all loan applications
export const getAllApplications = () => {
  return https.get("/applications");
};

// Get application by ID
export const getApplicationById = (id: string) => {
  return https.get(`/applications/${id}`);
};

// Update application status
export const updateApplicationStatus = (id: string, status: string) => {
  return https.patch(`/applications/${id}/status`, { status });
};

// Update application details
export const updateApplication = (id: string, data: any) => {
  return https.patch(`/applications/${id}`, data);
};
