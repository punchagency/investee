import https from "./http";

// Register new user
export const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  return https.post("/auth/register", data);
};

// Login user
export const login = (data: { email: string; password: string }) => {
  return https.post("/auth/login", data);
};

// Refresh access token
export const refreshToken = () => {
  return https.post("/auth/refresh-token");
};

// Logout user
export const logout = () => {
  return https.post("/auth/logout");
};

// Get current authenticated user
export const getCurrentUser = () => {
  return https.get("/auth/user");
};
