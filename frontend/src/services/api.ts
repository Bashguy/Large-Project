const API_URL = 'https://picnicpickup.online/api';

// Helper function for fetch requests
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  // Create fetch options without TypeScript annotations
  const fetchOptions: any = {
    credentials: 'include', // Include cookies
    ...options,
    headers
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    return data;
  } catch (error) {
    if (error.data) {
      throw {
        status: 500,
        message: 'Network error',
        error
      };
    }
  }
};

// Auth API
export const authApi = {

  signup: (userData) =>
    fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (userData) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  logout: () =>
    fetchApi('/auth/logout', { method: 'POST' }),

  newUsername: (userData) =>
    fetchApi('/auth/new-username', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  newEmail: (userData) =>
    fetchApi('/auth/new-email', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  newPassword: (userData) =>
    fetchApi('/auth/new-password', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  checkAuth: () =>
    fetchApi('/auth/check'),

  deleteAccount: () =>
    fetchApi('/auth/delete', { method: 'DELETE' }),

  addFriend: (friendUsername) =>
    fetchApi('/auth/friend', {
      method: 'POST',
      body: JSON.stringify({ friendUsername })
    }),

  removeFriend: (friendId) =>
    fetchApi(`/auth/friend/${friendId}`, { method: 'DELETE' }),

  getFriends: () =>
    fetchApi('/auth/friends'),

  updateGameStats: (data) =>
    fetchApi('/auth/game-stats', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

// Card Management API
export const cardApi = {
  createCard: (formData) => {
    // FormData needs different fetch options
    return fetch(`${API_URL}/card/create`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(resp => resp.json());
  },

  getCardsByType: (type) =>
    fetchApi(`/card/type/${type}`),

  getCardTotal: () =>
    fetchApi(`/card/count`),

  getCardById: (cardId) =>
    fetchApi(`/card/${cardId}`)
};

// User's Card Collection API
export const userCardApi = {
  getUserCards: (type) =>
    fetchApi(type ? `/card/collection/${type}` : '/card/collection'),

  removeCardFromCollection: (cardId) =>
    fetchApi(`/card/collection/${cardId}`, { method: 'DELETE' }),

  Unlock4Cards: (type) =>
    fetchApi(`/card/collection/unlock/${type}`, { method: 'POST' }),

  getFriendCards: (friendId, type) =>
    fetchApi(type ? `/card/friend-collection/${friendId}/${type}` : `/card/friend-collection/${friendId}`),
};

// Trade API
export const tradeApi = {
  sendTradeRequest: (data) =>
    fetchApi('/card/trade', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getUserTrades: () =>
    fetchApi('/card/trades'),

  acceptTrade: (tradeId) =>
    fetchApi(`/card/trade/accept/${tradeId}`, { method: 'POST' }),

  declineTrade: (data) =>
    fetchApi(`/card/trade/decline/${data.tradeType}/${data.tradeId}`, { method: 'POST' })
};
