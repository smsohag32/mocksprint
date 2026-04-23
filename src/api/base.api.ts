import { getCookie } from "@/helpers/cookie";
import {
   createApi,
   fetchBaseQuery,
   type BaseQueryFn,
   type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query/react";

import { refreshTokenApi } from "@/services/auth/auth.service";
import { logoutUser, updateToken } from "@/store/slices/auth.slice";

const API_BASE_URL = `${import.meta.env.VITE_BASE_API_URL}`;

const baseQuery = fetchBaseQuery({
   baseUrl: API_BASE_URL,
   prepareHeaders: (headers) => {
      const accessToken = getCookie("access_token");
      if (accessToken) {
         headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
   },
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
   args,
   api,
   extraOptions,
) => {
   let result = await baseQuery(args, api, extraOptions);

   if (result?.error?.status === 401) {
      const refreshToken = getCookie("refresh_token");

      if (refreshToken) {
         if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshTokenApi(refreshToken)
               .then((res) => {
                  const payloadData = res.data || res;
                  api.dispatch(updateToken(payloadData.token));
                  return payloadData.token;
               })
               .catch(() => {
                  api.dispatch(logoutUser());
                  return null;
               })
               .finally(() => {
                  isRefreshing = false;
                  refreshPromise = null;
               });
         }

         const newToken = await refreshPromise;
         if (newToken) {
            result = await baseQuery(args, api, extraOptions);
         }
      } else {
         api.dispatch(logoutUser());
      }
   }

   return result;
};

/**
 * Foundation API provider for the application.
 * All domain-specific APIs should inject endpoints into this baseApi.
 */
export const baseApi = createApi({
   reducerPath: "api",
   baseQuery: baseQueryWithReauth,
   tagTypes: ["User", "Question", "Interview", "Submission", "Leaderboard", "Profile", "Categories"],
   endpoints: () => ({}),
});
