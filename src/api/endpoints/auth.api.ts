import { baseApi } from "@/api/base.api";

/**
 * Authentication management endpoints.
 * All auth calls use the /auth prefix (baseUrl is /api/v1).
 */
export const authApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      // ── Register ──────────────────────────────────
      register: builder.mutation<
         any,
         { name: string; email: string; password: string }
      >({
         query: (userData) => ({
            url: "/auth/sign-up",
            method: "POST",
            body: userData,
         }),
      }),

      // ── Login ─────────────────────────────────────
      login: builder.mutation<
         any,
         { email: string; password: string }
      >({
         query: (credentials) => ({
            url: "/auth/sign-in",
            method: "POST",
            body: credentials,
         }),
         async onQueryStarted(_args, { dispatch, queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               // data structure: { success, token, refresh_token, user }
               if (data?.success) {
                  const { setCredentials } = await import("@/store/slices/auth.slice");
                  dispatch(setCredentials({
                     user: data.user,
                     token: data.token,
                     refresh_token: data.refresh_token
                  }));
               }
            } catch (err) {
               // handle error or just let the component catch it
            }
         },
      }),

      // ── Logout ────────────────────────────────────
      logout: builder.mutation<void, void>({
         query: () => ({
            url: "/auth/logout",
            method: "POST",
         }),
      }),

      // ── Refresh Access Token ───────────────────────
      refreshToken: builder.mutation<{ token: string }, { refresh_token: string }>({
         query: (body) => ({
            url: "/auth/refresh",
            method: "POST",
            body,
         }),
      }),

      // ── Get Current User ──────────────────────────
      getMe: builder.query<any, void>({
         query: () => "/auth/me",
         providesTags: ["User"],
      }),

      // ── Verify Email (link-based) ─────────────────
      verifyEmail: builder.query<any, string>({
         query: (token) => `/auth/verify-email?token=${token}`,
      }),

      // ── Send OTP ──────────────────────────────────
      sendOtp: builder.mutation<any, { email: string }>({
         query: (body) => ({
            url: "/auth/send-otp",
            method: "POST",
            body,
         }),
      }),

      // ── Request Password Reset OTP ────────────────
      requestPasswordReset: builder.mutation<any, { email: string }>({
         query: (body) => ({
            url: "/auth/reset-password",
            method: "POST",
            body,
         }),
      }),

      // ── Verify OTP ────────────────────────────────
      verifyOtp: builder.mutation<any, { email: string; otp: string }>({
         query: (body) => ({
            url: "/auth/otp-verify",
            method: "POST",
            body,
         }),
      }),

      // ── Set New Password ──────────────────────────
      setNewPassword: builder.mutation<
         any,
         { email: string; new_password: string }
      >({
         query: (body) => ({
            url: "/auth/new-password",
            method: "POST",
            body,
         }),
      }),
   }),
   overrideExisting: false,
});

export const {
   useRegisterMutation,
   useLoginMutation,
   useLogoutMutation,
   useRefreshTokenMutation,
   useGetMeQuery,
   useVerifyEmailQuery,
   useSendOtpMutation,
   useRequestPasswordResetMutation,
   useVerifyOtpMutation,
   useSetNewPasswordMutation,
} = authApi;
