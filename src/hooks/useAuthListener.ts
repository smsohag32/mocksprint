import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { supabase } from '@/integrations/supabase/client';
import { setCredentials, setLoading, logout } from '@/features/auth/authSlice';
import type { User } from '@/types';

export function useAuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user: User = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || '',
          email: session.user.email || '',
          role: 'user',
          avatar_url: profile?.avatar_url || undefined,
          created_at: profile?.created_at || session.user.created_at,
        };

        // Check if admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (roles?.some((r: any) => r.role === 'admin')) {
          user.role = 'admin';
        }

        dispatch(setCredentials({ user, token: session.access_token }));
      } else {
        dispatch(logout());
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        dispatch(setLoading(false));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);
}
