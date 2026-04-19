import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';
import type { Question } from '@/types';

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], { category?: string; difficulty?: string }>({
      queryFn: async ({ category, difficulty } = {}) => {
        let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
        if (category) query = query.eq('category', category);
        if (difficulty) query = query.eq('difficulty', difficulty);
        const { data, error } = await query;
        if (error) return { error: { message: error.message } };
        return { data: (data as Question[]) || [] };
      },
      providesTags: ['Question'],
    }),
    getQuestion: builder.query<Question, string>({
      queryFn: async (id) => {
        const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
        if (error) return { error: { message: error.message } };
        return { data: data as Question };
      },
      providesTags: ['Question'],
    }),
    createQuestion: builder.mutation<Question, Partial<Question>>({
      queryFn: async (question) => {
        const { data, error } = await supabase.from('questions').insert(question as any).select().single();
        if (error) return { error: { message: error.message } };
        return { data: data as Question };
      },
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<Question, { id: string; updates: Partial<Question> }>({
      queryFn: async ({ id, updates }) => {
        const { data, error } = await supabase.from('questions').update(updates as any).eq('id', id).select().single();
        if (error) return { error: { message: error.message } };
        return { data: data as Question };
      },
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('questions').delete().eq('id', id);
        if (error) return { error: { message: error.message } };
        return { data: undefined };
      },
      invalidatesTags: ['Question'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
