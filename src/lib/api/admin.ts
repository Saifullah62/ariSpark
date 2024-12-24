import { supabase } from '../supabase';

export const adminApi = {
  async createAdminUser(email: string, password: string) {
    // Create user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) throw signUpError;
    if (!user) throw new Error('Failed to create user');

    // Set admin flag
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: user.id, 
        email: user.email,
        is_admin: true,
        full_name: 'Admin User'
      }]);
    
    if (profileError) throw profileError;

    return user;
  }
};