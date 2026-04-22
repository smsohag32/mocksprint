import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import {
   loginUser,
   logoutUser,
   refreshToken,
} from "@/store/slices/auth.slice";
import { RootState } from "@/store";

/**
 * Hook for managing authentication state and actions.
 * Provides a simplified interface for components to interact with auth.
 */
export const useAuth = () => {
   const dispatch = useAppDispatch();
   const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

   const isAuthenticated = useMemo(() => !!token, [token]);

   const login = async (credentials: any) => {
      return dispatch(loginUser(credentials)).unwrap();
   };

   const logout = () => {
      dispatch(logoutUser());
      if (typeof window !== "undefined") {
         window.location.href = "/login";
      }
   };

   const refresh = async () => {
      return dispatch(refreshToken()).unwrap();
   };

   return {
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refresh,
   };
};
