import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/api/base.api';
import authReducer from '@/store/slices/auth.slice';
import themeReducer from '@/store/slices/theme.slice';

/**
 * Global Redux store configuration.
 * Centralizes reducers, middleware (including RTK Query), and state initialization.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
