import { supabase } from '../supabase';
import type { Profile } from '../../types/database';

const ADMIN_EMAIL = 'admin@studentsuccesspro.com';
const ADMIN_PASSWORD = 'Admin123!@#';

export const authApi = {
  async signIn(email: string, password: string): Promise<Profile> {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      throw new Error('Invalid email or password. Please try again.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to load user profile.');
    }

    return profile;
  },

  async signUp(email: string, password: string): Promise<void> {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
      throw new Error('Failed to create account. Please try again.');
    }

    if (!user) {
      throw new Error('Failed to create user.');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: user.id, 
        email: user.email,
        full_name: null,
        is_admin: false
      }]);
    
    if (profileError) {
      throw new Error('Failed to create user profile.');
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Failed to sign out.');
    }
  },

  async initializeAdmin(): Promise<void> {
    try {
      // Try to sign in as admin first
      const { data } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (data.user) {
        // Admin exists, no need to create
        await this.signOut();
        return;
      }
    } catch {
      // Admin doesn't exist, create it
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (signUpError || !user) {
        console.error('Failed to create admin user:', signUpError);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: ADMIN_EMAIL,
          full_name: 'Admin User',
          is_admin: true
        }]);

      if (profileError) {
        console.error('Failed to create admin profile:', profileError);
      }
    }
  }
};