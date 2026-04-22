import { baseApi } from '@/api/base.api';
import { updateUser } from '@/store/slices/auth.slice';

/**
 * User profile and management endpoints.
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => '/auth/me',
      transformResponse: (response: any) => response.user,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.user) {
            dispatch(updateUser(data.user));
          }
        } catch {
          // Error handled by the component
        }
      },
      invalidatesTags: ['Profile', 'User'],
    }),
    getAllUsers: builder.query<any[], void>({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    getUsersPaged: builder.query<{ users: any[]; total: number }, { page: number; limit: number; search?: string; status?: string; role?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: any) => response.user,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    toggleUserStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<any, { id: string; name: string; email: string; role: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUsersPagedQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
