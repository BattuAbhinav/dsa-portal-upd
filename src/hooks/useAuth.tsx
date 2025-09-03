
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signIn = async (usernameOrEmail: string, password: string) => {
    // First try to find the user's email by username if it's not an email
    const isEmail = usernameOrEmail.includes('@');
    
    let emailToUse = usernameOrEmail;
    
    if (!isEmail) {
      // Look up email by username in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', usernameOrEmail)
        .single();
      
      if (profile?.email) {
        emailToUse = profile.email;
      } else {
        return { error: { message: 'Username not found' } };
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};
