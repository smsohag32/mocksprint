import { baseApi } from '@/api/base.api';

/**
 * Leaderboard data endpoints.
 */
export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<any[], void>({
      query: () => '/leaderboard',
      providesTags: ['Leaderboard'],
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
