import axiosInstance from './axiosInstance';

export const loginUser = (username, password) => {
    return axiosInstance.post('users/login', {
        username,
        password,
    });
};