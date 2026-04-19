import { baseApi } from '@/api/base.api';

/**
 * User profile and management endpoints.
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    getAllUsers: builder.query<any[], void>({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} = userApi;
