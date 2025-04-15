import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, cardApi, userCardApi, tradeApi } from '../services/api';
import useAuthStore from '../store/authStore';

// ==================== Auth Queries ====================

export const useFriends = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await authApi.getFriends();
      return response.data || [];
    },
    enabled: isAuthenticated
  });
};

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (username) => {
      const response = await authApi.addFriend(username);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (friendId) => {
      const response = await authApi.removeFriend(friendId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });
};

export const useUpdateGameStats = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await authApi.updateGameStats(data);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};

// ==================== Card Queries ====================

export const useCardsByType = (type) => {
  return useQuery({
    queryKey: ['cards', type],
    queryFn: async () => {
      const response = await cardApi.getCardsByType(type);
      return response.data || [];
    }
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData) => {
      const response = await cardApi.createCard(formData);
      return response;
    },
    onSuccess: (data) => {
      if (data.data?.type) {
        queryClient.invalidateQueries({ queryKey: ['cards', data.data.type] });
      }
    }
  });
};

// ==================== User Card Collection Queries ====================

export const useUserCards = (type) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: ['userCards', type],
    queryFn: async () => {
      const response = await userCardApi.getUserCards(type);
      return response.data || [];
    },
    enabled: isAuthenticated
  });
};

export const useUnlock4Cards = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (type) => {
      const response = await userCardApi.Unlock4Cards(type);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCards'] });
    }
  });
};

// ==================== Trade Queries ====================

export const useUserTrades = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const response = await tradeApi.getUserTrades();
      return response.data || { sent: [], received: [] };
    },
    enabled: isAuthenticated
  });
};

export const useSendTradeRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await tradeApi.sendTradeRequest(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    }
  });
};

export const useAcceptTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tradeId) => {
      const response = await tradeApi.acceptTrade(tradeId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['userCards'] });
    }
  });
};

export const useDeclineTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await tradeApi.declineTrade(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    }
  });
};
