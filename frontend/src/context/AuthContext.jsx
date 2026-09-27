import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        localStorage.setItem('access_token', userData.access);
        localStorage.setItem('refresh_token', userData.refresh);
        localStorage.setItem('user', JSON.stringify({
            username: userData.username,
            role: userData.role,
            profile_photo: userData.profile_photo,
        }));
        setUser({
            username: userData.username,
            role: userData.role,
            profile_photo: userData.profile_photo,
        });
    };

    const updateUser = (newData) => {
        const updated = { ...user, ...newData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}