// src/stores/useAuthStore.js
import { create } from 'zustand';
import { authApi } from '../services/api';

const useAuthStore = create((set: any, get: any) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    msg: null,

    setUser: (user) => set({ user }),
    
    login: async (username, password) => {
      set({ isLoading: true, msg: null });
      try {
        const response = await authApi.login({ username, password });
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
            isLoading: false 
          });
        } else {
          set({ 
            msg: response.msg || 'Login failed', 
            isLoading: false 
          });
        }
      } catch (error) {
        set({ 
          msg: error.message || 'Login failed', 
          isLoading: false 
        });
      }
    },
    
    signup: async (email, username, password) => {
      set({ isLoading: true, msg: null });
      try {
        const response = await authApi.signup({ email, username, password });
        if (response.success && response.data) {
          set({ 
            msg: response.msg || 'Signup successful',
            isLoading: false 
          });
          return response.success;
        } else {
          set({ 
            msg: response.msg || 'Signup failed', 
            isLoading: false 
          });
        }
      } catch (error) {
        set({ 
          msg: error.message || 'Signup failed', 
          isLoading: false 
        });
      }
    },
    
    logout: async () => {
      set({ isLoading: true });
      try {
        const response = await authApi.logout();
        set({ 
          user: null, 
          msg: response.msg || 'Successfully logged out', 
          isAuthenticated: false, 
          isLoading: false 
        });
        return response;
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    },
    
    checkAuth: async () => {
      if (get().isAuthenticated) return;
      
      set({ isLoading: true });
      try {
        const response = await authApi.checkAuth();
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
            isLoading: false 
          });
        } else {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
        }
      } catch (error) {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false 
        });
      }
    },
  })
);

export default useAuthStore;
