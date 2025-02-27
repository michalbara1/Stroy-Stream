// src/utils/authUtils.ts

import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

//const navigate = useNavigate();

const getAccessToken = async (): Promise<string | null> => {
    const tokenExpiry = localStorage.getItem('accessTokenExpiry');
    const currentTime = Date.now();

    if (tokenExpiry && currentTime >= parseInt(tokenExpiry, 10)) {
        // Token is expired, refresh it
        return await refreshAccessToken();
    } else {
        // Token is still valid
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken) {
            await logout(useNavigate());
            return null;
        }
        return accessToken;
    }
};

// Function to refresh access token if expired
 const  refreshAccessToken = async (): Promise<string | null> => {
    const refreshTokenExpiry = localStorage.getItem('refreshTokenExpiry');
    const refreshToken = localStorage.getItem('refreshTokens');
    
    if (refreshTokenExpiry && Date.now() >= parseInt(refreshTokenExpiry, 10)) {
        // log out user if refresh token is expired
        await logout(useNavigate());
        return null;
    }

    try {
        const response = await api.get('/auth/refreshToken', {
            params: { refreshToken }
        });

        localStorage.setItem('accessToken', response.data.token);
        const newExpiryTime = Date.now() + 3600000; // 1 hour from now
        localStorage.setItem('accessTokenExpiry', newExpiryTime.toString());
      
        return response.data.token;
    } catch (error) {
        //logout user
        await logout(useNavigate());
        throw error;
    }
};

const logout = async (navigate: ReturnType<typeof useNavigate>): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshTokens');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiry');
    localStorage.removeItem('refreshTokenExpiry');
    localStorage.removeItem('refreshTokens');
    try {
        const response = await api.post('/auth/logout', { refreshToken });
        toast.success(response.data.message);
        return;
    } catch (error) {
        toast.error('Error logging out');
    } finally {
        navigate('/login');
    }
};

export { getAccessToken, refreshAccessToken, logout };