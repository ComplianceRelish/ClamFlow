import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // Mock authentication for demo
      const role = email.includes('admin') ? 'admin' : 
                   email.includes('supervisor') ? 'supervisor' :
                   email.includes('quality') ? 'quality' :
                   email.includes('management') ? 'management' : 'operator';

      const user = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        role
      };

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string, role: string) => {
    try {
      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        role
      };
      
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
}));