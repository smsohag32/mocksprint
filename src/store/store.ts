import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/services/api/authApi';
import { questionApi } from '@/services/api/questionApi';
import { interviewApi } from '@/services/api/interviewApi';
import { leaderboardApi } from '@/services/api/leaderboardApi';
import { userApi } from '@/services/api/userApi';
import authReducer from '@/features/auth/authSlice';
import themeReducer from '@/features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [interviewApi.reducerPath]: interviewApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      questionApi.middleware,
      interviewApi.middleware,
      leaderboardApi.middleware,
      userApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
