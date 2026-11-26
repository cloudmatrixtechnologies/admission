import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export const USE_MOCK_AUTH =
  process.env.EXPO_PUBLIC_MOCK_AUTH === 'true';

const TOKEN_KEY = 'admizan_auth_token';

export async function saveAuthToken(token) {
  if (!token) return;
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, String(token));
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, String(token));
}

export async function getAuthToken() {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function removeAuthToken() {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Ignore storage cleanup errors
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body:
      options.body && !isFormData && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        (response.status === 429
          ? 'Too many requests. Please wait before trying again.'
          : 'Request failed. Please check your details and try again.')
    );
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}