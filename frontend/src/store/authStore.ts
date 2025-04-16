// src/stores/useAuthStore.js
import { create } from 'zustand';
import { authApi } from '../services/api';

const useAuthStore = create((set: any, get: any) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user) => set({ user }),
    
    login: async (username, password) => {
      set({ isLoading: true });
      try {
        const response = await authApi.login({ username, password });
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
            isLoading: false 
          });
        }
        return response;
      } catch (error) {
        console.log(error);
      } finally {
        set({ isLoading: false });
      }
    },
    
    signup: async (email, username, password) => {
      set({ isLoading: true });
      try {
        const response = await authApi.signup({ email, username, password });
        return response;
      } catch (error) {
        console.log(error);
      } finally {
        set({ isLoading: false });
      }
    },
    
    logout: async () => {
      set({ isLoading: true });
      try {
        const response = await authApi.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
        return response;
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
      }
    },

    changeUsername: async (newUsername) => {
      set({ isLoading: true });
      try {
        const response = await authApi.newUsername({ newUsername });
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
          });
        }
        return { success: response.success, msg: response.msg };
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
      }
    },

    changeEmail: async (newEmail) => {
      set({ isLoading: true });
      try {
        const response = await authApi.newEmail({ newEmail });
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
          });
        }
        return { success: response.success, msg: response.msg };
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
      }
    },

    changePassword: async (oldPassword, newPassword) => {
      set({ isLoading: true });
      try {
        const response = await authApi.newPassword({ oldPassword, newPassword });
        if (response.success && response.data) {
          set({ 
            user: response.data,
            isAuthenticated: true,
          });
        }
        return { success: response.success, msg: response.msg };
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
      }
    },

    deleteAcc: async () => {
      set({ isLoading: true });
      try {
        const response = await authApi.deleteAccount();
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
        return response;
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
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
          });
        } else {
          set({ 
            user: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        set({ 
          user: null, 
          isAuthenticated: false, 
        });
      } finally {
        set({ isLoading: false });
      }
    },
  })
);

export default useAuthStore;
