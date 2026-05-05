import { baseApi } from '@/api/base.api';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({ url: '/blogs', params }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<any, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (_, __, slug) => [{ type: 'Blog' as const, id: slug }],
    }),
    getAdminBlogs: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({ url: '/blogs/admin/all', params }),
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
        // Let the browser set Content-Type with the boundary
        formData: true,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
