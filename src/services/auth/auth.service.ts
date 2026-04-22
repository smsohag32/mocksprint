const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000/api/v1";

/**
 * Manual fetch helpers used by Redux thunks and the re-auth middleware.
 * These bypass RTK Query intentionally (token refresh must not go through the interceptor).
 */

export const loginApi = async (credentials: {
   email: string;
   password: string;
}) => {
   const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send/receive httpOnly cookies
      body: JSON.stringify(credentials),
   });

   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || "Login failed.");
   }
   return data;
};

export const refreshTokenApi = async (refreshToken: string) => {
   const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refresh_token: refreshToken }),
   });

   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || "Token refresh failed.");
   }
   return data;
};

export const logoutApi = async (accessToken: string) => {
   await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
   });
};
