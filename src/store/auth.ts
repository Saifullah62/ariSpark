import { create } from 'zustand';
import type { Profile } from '../types/database';

interface AuthState {
  user: Profile | null;
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    id: '1',
    email: 'user@example.com',
    full_name: 'Demo User',
    major: 'Computer Science',
    year_of_study: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_admin: false
  }
}));