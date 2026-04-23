import { baseApi } from '../base.api';

export interface QuestionCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  categories: QuestionCategory[];
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  category: QuestionCategory;
}

export const questionCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse, { search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/admin/categories',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<SingleCategoryResponse, Partial<QuestionCategory>>({
      query: (body) => ({
        url: '/admin/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<SingleCategoryResponse, { id: string } & Partial<QuestionCategory>>({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = questionCategoryApi;
