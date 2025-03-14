import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { getAccessToken } from '../../utils/authUtils';

interface UserState {
    userId : string;
    email: string;
    password: string;
    accessToken: string;
    refreshTokens: string[];
    image: string;
    userName: string;
    errorMessage: string; 
    successMessage: string; 
    isLoggedIn: boolean;
}


export const register = createAsyncThunk(
    'user/register',
    async (userData: { email: string; password: string; userName: string, image?: string }, { rejectWithValue, fulfillWithValue }) => {
        try {
            console.log("Registering user with data:", {
                ...userData,
                password: userData.password ? "***" : undefined // Hide actual password in logs
            });
            
            // Check that api is correctly configured
            console.log("API base URL:", api.defaults.baseURL);
            
            const { data } = await api.post('/auth/register', userData);
            
            // Enhanced logging to see full response structure
            console.log("Registration successful - Full response:", JSON.stringify(data, null, 2));
            console.log("User object in response:", data.user ? JSON.stringify(data.user, null, 2) : "No user object");
            console.log("Image in response:", data.user?.image || "No image found in response");
            
            return fulfillWithValue(data);
        } catch (error : any) {
            console.error("Registration error:", error);
            
            // More detailed error logging
            if (error.response) {
                console.error("Error response:", {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
            
            return rejectWithValue(error.response?.data?.error || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (userData: { email: string; password: string }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', userData);
            return fulfillWithValue(data);
        } catch (error : any) {
            return rejectWithValue(error.response.data.error || 'Login failed');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (userData: { email: string}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/auth/googlelogin', userData);
            return fulfillWithValue(data);
        } catch (error : any) {
            return rejectWithValue(error.response.data.error || 'Login failed');
        }
    }
);

export const getUserInfo =  createAsyncThunk(
    'user/getUserInfo',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
         
            const { data } = await api.get('/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error : any) {
            return rejectWithValue(error.response.data.error || 'Failed to get user info');
        }
    }
);


export const update_profile =  createAsyncThunk(
    'user/update_profile',
    async (userData: { userName: string; image: unknown }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.post('/auth/user/update', userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error : any) {
            return rejectWithValue(error.response.data.error || 'Failed to get user info');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: '',
        password: '',
        accessToken: '',
        refreshTokens: [],
        image: '',
        userName: '',
        errorMessage: '',
        successMessage: '',
        userId: '',
        isLoggedIn: localStorage.getItem('accessToken') ? true : false, 
    } as UserState,
    reducers: {       
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.email = '';
            state.password = '';
            state.accessToken = '';
            state.refreshTokens = [];
            state.image = '';
            state.userName = 'Guest';
            state.successMessage = "";
            state.userId = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; 
            
            // Add this line to save the image from the registration response
            if (payload.user && payload.user.image) {
                state.image = payload.user.image;
            }
        })
        .addCase(register.rejected, (state, { payload }) => {
            state.errorMessage = payload as string;
        })
        .addCase(login.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message;
            localStorage.setItem('accessToken', payload.accessToken);
            localStorage.setItem('refreshTokens', payload.refreshToken);
            localStorage.setItem('accessTokenExpiry', (Date.now() + 3600000).toString());
            localStorage.setItem('refreshTokenExpiry', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
            state.userName = payload.user.userName;
            state.image = payload.user.image || null;
        })
        .addCase(login.rejected, (state, { payload }) => {
            state.errorMessage = payload as string;
        })
        .addCase(getUserInfo.fulfilled, (state, { payload }) => {
            state.userName = payload.userName;
            state.image = payload.image;
            state.userId = payload.userId;
        })
        .addCase(getUserInfo.rejected, (state) => {
            state.userName = '';
            state.image = '';
            state.userId = '';
        })
        .addCase(update_profile.fulfilled, (state, { payload }) => {
            state.image = payload.image;
            state.userName = payload.userName;
            
        })
        .addCase(update_profile.rejected, (state) => {
            state.errorMessage = "Error updating profile";
        })
        .addCase(googleLogin.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message;
            localStorage.setItem('accessToken', payload.accessToken);
            localStorage.setItem('refreshTokens', payload.refreshToken);
            localStorage.setItem('accessTokenExpiry', (Date.now() + 3600000).toString());
            localStorage.setItem('refreshTokenExpiry', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
        })
        .addCase(googleLogin.rejected, (state, { payload }) => {
            state.errorMessage = payload as string;
        })
    }
});

export const {messageClear,logoutUser} = userSlice.actions;
export default userSlice.reducer;