import { baseApi } from '@/api/base.api';

/**
 * Interview management endpoints.
 */
export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInterviews: builder.query<any, { page: number; limit: number }>({
      query: (params) => ({
        url: '/admin/interviews',
        params,
      }),
      providesTags: ['Interview'],
    }),
    getInterviews: builder.query<any[], void>({
      query: () => '/interviews',
      providesTags: ['Interview'],
    }),
    getHistory: builder.query<any[], void>({
      query: () => '/interviews',
      providesTags: ['Interview'],
    }),
    getSubmissions: builder.query<any[], void>({
      query: () => '/interviews',
      providesTags: ['Interview'],
    }),
    getInterviewById: builder.query<any, string>({
      query: (id) => `/interviews/${id}`,
      providesTags: (_, __, id) => [{ type: 'Interview', id }],
    }),
    startInterview: builder.mutation<any, { question_id: string }>({
      query: (data) => ({
        url: '/interviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Interview'],
    }),
    submitInterview: builder.mutation<any, { id: string; code: string }>({
      query: ({ id, ...body }) => ({
        url: `/interviews/${id}/submit`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Interview', id }, 'Leaderboard'],
    }),
    abandonInterview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/interviews/${id}/abandon`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Interview', id }],
    }),
    getHint: builder.mutation<{ hint: string }, { id: string; code: string }>({
      query: ({ id, ...body }) => ({
        url: `/interviews/${id}/hint`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminInterviewsQuery,
  useGetInterviewsQuery,
  useGetHistoryQuery,
  useGetSubmissionsQuery,
  useGetInterviewByIdQuery,
  useStartInterviewMutation,
  useSubmitInterviewMutation,
  useAbandonInterviewMutation,
  useGetHintMutation,
} = interviewApi;
