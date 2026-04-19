import { baseApi } from '@/api/base.api';

/**
 * Question management endpoints.
 */
export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<any[], { category?: string; difficulty?: string } | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters && filters.category) params.append('category', filters.category);
        if (filters && filters.difficulty) params.append('difficulty', filters.difficulty);
        const queryString = params.toString();
        return queryString ? `/questions?${queryString}` : '/questions';
      },
      providesTags: ['Question'],
    }),
    getQuestionById: builder.query<any, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (_, __, id) => [{ type: 'Question', id }],
    }),
    createQuestion: builder.mutation<any, any>({
      query: (data) => ({
        url: '/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Question', id }, 'Question'],
    }),
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
