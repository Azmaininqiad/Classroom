import { supabase } from './supabase';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) throw error;
    
    toast.success('Account created successfully!');
    return { user: data.user, error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { user: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success('Signed in successfully!');
    return { user: data.user, error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { user: null, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
};

export const signInWithGitHub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success('Signed out successfully!');
    return { error: null };
  } catch (error: any) {
    toast.error(error.message);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    return null;
  }
};