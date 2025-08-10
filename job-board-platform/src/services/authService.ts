// Types
interface User {
    id: number;
    name: string;
    email: string;
    provider: string;
    avatar?: string;
    is_verified: boolean;
    created_at?: string;
}

// API Base URL
const API_BASE_URL = 'http://localhost:5003/api';

// Auth API endpoints
const AUTH_ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`
};

// Token management
const TOKEN_KEY = 'opportuna_token';
const USER_KEY = 'opportuna_user';

export const authService = {
    // Get stored token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Set token
    setToken: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Remove token
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Get stored user
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Set user
    setUser: (user: User) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = authService.getToken();
        const user = authService.getUser();
        return !!(token && user);
    },

    // Get auth headers
    getAuthHeaders: () => {
        const token = authService.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Register user
    register: async (userData: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        try {
            console.log('🚀 Making registration request to:', AUTH_ENDPOINTS.REGISTER);
            console.log('📦 Request data:', { ...userData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            console.log('📡 Response status:', response.status, response.statusText);
            console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📋 Response data:', data);

            if (data.success) {
                authService.setToken(data.data.token);
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed. Please check your connection and try again.'
            };
        }
    },

    // Login user
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                authService.setToken(data.data.token);
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed. Please check your connection and try again.'
            };
        }
    },

    // Google authentication
    googleAuth: async (userData: {
        name: string;
        email: string;
        provider_id: string;
        avatar?: string;
    }) => {
        try {
            console.log('Attempting to connect to:', AUTH_ENDPOINTS.GOOGLE_AUTH);
            console.log('Sending data:', userData);

            const response = await fetch(AUTH_ENDPOINTS.GOOGLE_AUTH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                return {
                    success: false,
                    message: `Server error: ${response.status} - ${errorText}`
                };
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                authService.setToken(data.data.token);
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Google auth error:', error);
            return {
                success: false,
                message: `Network error: ${error instanceof Error ? error.message : 'Google authentication failed. Please try again.'}`
            };
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                message: 'Failed to get user profile.'
            };
        }
    },

    // Update user profile
    updateProfile: async (updateData: { name?: string; avatar?: string }) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.UPDATE_PROFILE, {
                method: 'PATCH',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: 'Failed to update profile.'
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
                method: 'POST',
                headers: authService.getAuthHeaders()
            });

            const data = await response.json();

            // Clear local storage regardless of server response
            authService.removeToken();

            return data;
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local storage even if server request fails
            authService.removeToken();
            return {
                success: true,
                message: 'Logged out successfully.'
            };
        }
    },

    // Sync Firebase user to MySQL database
    syncFirebaseUser: async (userData: {
        name: string;
        email: string;
        firebaseUid: string;
        provider?: string;
    }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/sync-firebase-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                authService.setToken(data.data.token);
                authService.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Sync Firebase user error:', error);
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.'
            };
        }
    },

    // Delete user from both Firebase and MySQL database
    deleteUser: async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/delete-user`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                // Clear local storage after successful deletion
                authService.removeToken();
            }

            return data;
        } catch (error) {
            console.error('Delete user error:', error);
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.'
            };
        }
    },

    // Delete user from MySQL database only (when user is already deleted from Firebase)
    deleteUserFromDatabase: async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/delete-user-db`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Delete user from database error:', error);
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.'
            };
        }
    }
};
