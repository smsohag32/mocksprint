import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';
import type { LeaderboardEntry } from '@/types';

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Leaderboard'],
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardEntry[], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('leaderboard')
          .select('*, profiles(*)')
          .order('total_score', { ascending: false })
          .limit(50);
        if (error) return { error: { message: error.message } };
        return { data: (data as any[]) || [] };
      },
      providesTags: ['Leaderboard'],
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
