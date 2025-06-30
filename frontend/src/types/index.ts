// Temporary types to replace @finlearn/shared
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utility function
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}; 