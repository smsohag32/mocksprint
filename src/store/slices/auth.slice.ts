import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "@/helpers/cookie";
import { loginApi, logoutApi, refreshTokenApi } from "@/services/auth/auth.service";

/* ─── Persisted State Hydration ──────────────────────── */
const getPersistedToken = getCookie("access_token");
const rawUserInfo = getCookie("user_info") || "";
const getPersistedUser = rawUserInfo ? JSON.parse(rawUserInfo) : null;

const initialState: {
   token: string | null;
   user: any | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;
} = {
   token: getPersistedToken || null,
   user: getPersistedUser,
   isAuthenticated: !!getPersistedToken,
   isLoading: false,
   error: null,
};

/* ─── Async Thunks ───────────────────────────────────── */
export const loginUser = createAsyncThunk<any, any>(
   "auth/loginUser",
   async (credentials, { rejectWithValue }) => {
      try {
         const response = await loginApi(credentials);
         return response;
      } catch (error: any) {
         return rejectWithValue(error?.message || "Login failed");
      }
   }
);

export const refreshToken = createAsyncThunk<any, void>(
   "auth/refreshToken",
   async (_, { rejectWithValue }) => {
      try {
         const oldRefreshToken = getCookie("refresh_token");
         if (!oldRefreshToken) throw new Error("No refresh token");
         const response = await refreshTokenApi(oldRefreshToken);
         return response;
      } catch (error: any) {
         return rejectWithValue(error?.message || "Token refresh failed");
      }
   }
);

export const logoutUserThunk = createAsyncThunk<void, void>(
   "auth/logoutUser",
   async (_, { getState, rejectWithValue }) => {
      try {
         const state: any = getState();
         const token = state.auth?.token;
         if (token) await logoutApi(token);
      } catch (error: any) {
         return rejectWithValue(error?.message || "Logout failed");
      }
   }
);

/* ─── Slice ──────────────────────────────────────────── */
const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      /** Immediately clear state + cookies (used by RTK Query re-auth interceptor) */
      logoutUser: (state) => {
         state.token = null;
         state.user = null;
         state.isAuthenticated = false;
         state.error = null;
         deleteCookie("access_token");
         deleteCookie("refresh_token");
         deleteCookie("user_info");
      },
      /** Used by the base query re-auth interceptor when a new access token is issued */
      updateToken: (state, action) => {
         state.token = action.payload;
         state.isAuthenticated = !!action.payload;
         setCookie("access_token", action.payload);
      },
      /** Manually set credentials (e.g., after register + auto-login) */
      setCredentials: (state, action) => {
         const { user, token, refresh_token } = action.payload;
         state.user = user ?? state.user;
         state.token = token ?? state.token;
         state.isAuthenticated = !!(token ?? state.token);
         if (token) setCookie("access_token", token);
         if (refresh_token) setCookie("refresh_token", refresh_token);
         if (user) setCookie("user_info", JSON.stringify(user));
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
   },
   extraReducers: (builder) => {
      /* ── Login ── */
      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            const payload = action.payload?.data ?? action.payload;
            const { token, refresh_token, user } = payload;

            state.token = token ?? null;
            state.user = user ?? null;
            state.isAuthenticated = !!token;
            state.error = null;

            if (token) setCookie("access_token", token);
            if (refresh_token) setCookie("refresh_token", refresh_token);
            if (user) setCookie("user_info", JSON.stringify(user));
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = (action.payload as string) || "Login failed";
         });

      /* ── Refresh Token ── */
      builder
         .addCase(refreshToken.fulfilled, (state, action) => {
            const payload = action.payload?.data ?? action.payload;
            const { token, refresh_token } = payload;
            state.token = token ?? null;
            state.isAuthenticated = !!token;
            if (token) setCookie("access_token", token);
            if (refresh_token) setCookie("refresh_token", refresh_token);
         })
         .addCase(refreshToken.rejected, (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            deleteCookie("access_token");
            deleteCookie("refresh_token");
            deleteCookie("user_info");
         });

      /* ── Logout ── */
      builder
         .addCase(logoutUserThunk.fulfilled, (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            deleteCookie("access_token");
            deleteCookie("refresh_token");
            deleteCookie("user_info");
         });
   },
});

export const { logoutUser, updateToken, setCredentials, setLoading } =
   authSlice.actions;

export default authSlice.reducer;
