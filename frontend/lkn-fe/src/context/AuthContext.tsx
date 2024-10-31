import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    username: string | null;
    lastlogin: string | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [lastlogin, setLastLogin] = useState<string | null>(null);

    // Load tokens from localStorage on initial render
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // get username from decode storedAccessToken with jwt
        if (storedAccessToken) {
            try {
                const user = jwtDecode(storedAccessToken) as { username?: string; lastlogin?: string }; // Decode the token
                if (user) {
                    setUsername(user.username || null); // Set username, defaulting to null if not present
                    setLastLogin(user.lastlogin || null); // Set last login, defaulting to null if not present
                } else {
                    console.warn('Decoded token is empty or invalid');
                }
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        } else {
            console.log('No access token available');
        }


        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    const login = (newAccessToken: string, newRefreshToken: string) => {
        // Decode the token
        const user = jwtDecode(newAccessToken) as { username?: string; lastlogin?: string }; // Decode the token
        setUsername(user.username || null); // Set username, defaulting to null if not present
        setLastLogin(user.lastlogin || null); // Set last login, defaulting to null if not present

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        // Save tokens to localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);

        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ username, lastlogin, accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};