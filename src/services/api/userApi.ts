import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) return { error: { message: error.message } };
        return { data };
      },
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<any, { name: string }>({
      queryFn: async ({ name }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };
        const { data, error } = await supabase.from('profiles').update({ name }).eq('id', user.id).select().single();
        if (error) return { error: { message: error.message } };
        return { data };
      },
      invalidatesTags: ['Profile'],
    }),
    getAllUsers: builder.query<any[], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) return { error: { message: error.message } };
        return { data: data || [] };
      },
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) return { error: { message: error.message } };
        return { data: undefined };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApi;
