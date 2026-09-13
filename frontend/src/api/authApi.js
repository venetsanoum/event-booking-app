import axiosInstance from './axiosInstance';

export const loginUser = (username, password) => {
    return axiosInstance.post('users/login/', {
        username,
        password,
    });
};

export const signupUser = (userData) => {
    return axiosInstance.post('users/register/', userData);
};

export const getMe = () => {
    return axiosInstance.get('users/me/');
}