import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setLoading, logoutUser } from "@/store/slices/auth.slice";
import { useVerifyQuery } from "@/api/endpoints/auth.api";

/**
 * Global listener that synchronizes the authentication state with server data on mount.
 */
export function useAuthListener() {
   const dispatch = useAppDispatch();
   const { data, error, isLoading } = useVerifyQuery();

   useEffect(() => {
      if (isLoading) {
         dispatch(setLoading(true));
         return;
      }

      if (data && data.user) {
         dispatch(
            setCredentials({
               user: data.user,
               token: localStorage.getItem("access_token") || undefined,
            }),
         );
      } else if (error) {
         dispatch(logoutUser());
      } else {
         dispatch(setLoading(false));
      }
   }, [data, error, isLoading, dispatch]);
}
