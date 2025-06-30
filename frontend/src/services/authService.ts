import { AuthResponse, LoginRequest, RegisterRequest, ApiResponse } from '../types';
import { apiClient } from './apiClient';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  } as LoginRequest);

  return response.data.data!;
};

export const register = async (
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
    email,
    username,
    password,
  } as RegisterRequest);

  return response.data.data!;
};

export const refreshToken = async (): Promise<{ token: string; refreshToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.post<ApiResponse<{ token: string; refreshToken: string }>>(
    '/auth/refresh',
    { refreshToken }
  );

  return response.data.data!;
};

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } catch (error) {
    // Continue with logout even if API call fails
    console.warn('Logout API call failed:', error);
  }
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/auth/me');
  return response.data.data;
}; 