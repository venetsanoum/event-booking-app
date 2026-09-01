import axiosInstance from './axiosInstance';

export const loginUser = (username, password) => {
    return axiosInstance.post('users/login', {
        username,
        password,
    });
};

export const signupUser = (userData) => {
    return axiosInstance.post('users/signup', userData);
};