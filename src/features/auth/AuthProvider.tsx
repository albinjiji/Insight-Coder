'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/lib/supabase/client';
import { setUser, clearUser } from './auth-slice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const supabase = createClient();

    // Hydrate session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dispatch(setUser({ id: user.id, email: user.email ?? '' }));
      } else {
        dispatch(clearUser());
      }
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser({ id: session.user.id, email: session.user.email ?? '' }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
