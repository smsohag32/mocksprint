const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000/api';

/**
 * Service for manual authentication API calls.
 * Used primarily by Redux thunks and the re-authentication middleware.
 */

export const loginApi = async (credentials: any) => {
   const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
   }

   return response.json();
};

export const refreshTokenApi = async (refreshToken: string) => {
   const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Refresh token failed');
   }

   return response.json();
};
