import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "@/helpers/cookie";
import { loginApi, refreshTokenApi } from "@/services/auth/auth.service";

const getPersistedToken = getCookie("access_token");
const cookieValue = getCookie("user_info") || "";
const getPersistedUser = cookieValue ? JSON.parse(cookieValue) : null;

const initialState: any = {
   token: getPersistedToken,
   user: getPersistedUser,
   isLoading: false,
   error: null,
};

export const loginUser = createAsyncThunk<any, any>(
   "auth/loginUser",
   async (credentials, { rejectWithValue }: any) => {
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
   async (_, { rejectWithValue }: any) => {
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

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logoutUser: (state) => {
         state.token = null;
         state.user = null;
         deleteCookie("access_token");
         deleteCookie("refresh_token");
         deleteCookie("user_info");
      },
      updateUserSignatureUrl: (state, action) => {
         if (state.user) {
            state.user.signatureUrl = action.payload;
            setCookie("user_info", JSON.stringify(state.user));
         }
      },
      setCredentials: (state, action) => {
         const { user, token } = action.payload;
         state.user = user;
         state.token = token;
         if (token) setCookie("access_token", token);
         if (user) setCookie("user_info", JSON.stringify(user));
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      updateToken: (state, action) => {
         state.token = action.payload;
         setCookie("access_token", action.payload);
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            const payloadData = action.payload.data || action.payload;
            const { token, refresh_token, ...restUserInfo } = payloadData;
            
            state.token = token;
            state.user = restUserInfo;

            if (token) setCookie("access_token", token);
            if (refresh_token) setCookie("refresh_token", refresh_token);
            if (state.user) setCookie("user_info", JSON.stringify(state.user));
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Login failed";
         })
         .addCase(refreshToken.fulfilled, (state, action) => {
            const payloadData = action.payload.data || action.payload;
            const { token, refresh_token } = payloadData;
            state.token = token;
            if (token) setCookie("access_token", token);
            if (refresh_token) setCookie("refresh_token", refresh_token);
         })
         .addCase(refreshToken.rejected, (state) => {
            state.token = null;
            state.user = null;
            deleteCookie("access_token");
            deleteCookie("refresh_token");
            deleteCookie("user_info");
         });
   },
});

export const { logoutUser, updateUserSignatureUrl, setCredentials, setLoading, updateToken } = authSlice.actions;
export default authSlice.reducer;
