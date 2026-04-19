import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';
import type { Interview, Submission } from '@/types';

export const interviewApi = createApi({
  reducerPath: 'interviewApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Interview', 'Submission'],
  endpoints: (builder) => ({
    startInterview: builder.mutation<Interview, { question_id: string }>({
      queryFn: async ({ question_id }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        const { data, error } = await supabase.from('interviews').insert({
          user_id: user.id,
          question_id,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        }).select().single();
        if (error) return { error: { message: error.message } };
        return { data: data as Interview };
      },
      invalidatesTags: ['Interview'],
    }),
    submitInterview: builder.mutation<Submission, { question_id: string; code: string; interview_id: string }>({
      queryFn: async ({ question_id, code, interview_id }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        // Update interview status
        await supabase.from('interviews').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        }).eq('id', interview_id);
        // Create submission
        const score = Math.floor(Math.random() * 40) + 60; // Mock score
        const { data, error } = await supabase.from('submissions').insert({
          user_id: user.id,
          question_id,
          code,
          score,
          feedback: score >= 80 ? 'Great solution! Clean and efficient.' : 'Good attempt. Consider optimizing your approach.',
        }).select().single();
        if (error) return { error: { message: error.message } };
        // Update leaderboard
        const { data: existing } = await supabase.from('leaderboard').select('*').eq('user_id', user.id).single();
        if (existing) {
          await supabase.from('leaderboard').update({ total_score: existing.total_score + score }).eq('user_id', user.id);
        } else {
          await supabase.from('leaderboard').insert({ user_id: user.id, total_score: score, rank: 0 });
        }
        return { data: data as Submission };
      },
      invalidatesTags: ['Interview', 'Submission'],
    }),
    getHistory: builder.query<Interview[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        const { data, error } = await supabase.from('interviews')
          .select('*, questions(*)')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });
        if (error) return { error: { message: error.message } };
        return { data: (data as any[]) || [] };
      },
      providesTags: ['Interview'],
    }),
    getSubmissions: builder.query<Submission[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        const { data, error } = await supabase.from('submissions')
          .select('*, questions(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) return { error: { message: error.message } };
        return { data: (data as any[]) || [] };
      },
      providesTags: ['Submission'],
    }),
  }),
});

export const {
  useStartInterviewMutation,
  useSubmitInterviewMutation,
  useGetHistoryQuery,
  useGetSubmissionsQuery,
} = interviewApi;
