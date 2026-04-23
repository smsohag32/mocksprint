import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setLoading, logoutUser } from "@/store/slices/auth.slice";
import { useGetMeQuery } from "@/api/endpoints/auth.api";
import { getCookie } from "@/helpers/cookie";

/**
 * Global listener that synchronizes the authentication state with server data on mount.
 */
export function useAuthListener() {
   const dispatch = useAppDispatch();
   const token = getCookie("access_token");
   
   // Only run the query if we have a token to verify
   const { data, error, isLoading } = useGetMeQuery(undefined, { 
      skip: !token 
   });

   useEffect(() => {
      // If we don't even have a token, we aren't authenticated
      if (!token) {
         dispatch(setLoading(false));
         return;
      }

      if (isLoading) {
         dispatch(setLoading(true));
         return;
      }

      if (data && data.user) {
         dispatch(
            setCredentials({
               user: data.user,
               token: token,
            }),
         );
      } else if (error) {
         dispatch(logoutUser());
      }
      
      dispatch(setLoading(false));
   }, [data, error, isLoading, dispatch, token]);
}
