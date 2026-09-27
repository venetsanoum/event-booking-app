// API calls για την αυθεντικότητα και τον λογαριασμό του συνδεδεμένου χρήστη
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
};

// Το data είναι FormData, ώστε να μπορεί να σταλεί και η φωτογραφία προφίλ
export const editMe = (data) => {
    return axiosInstance.patch('users/me/edit/', data);
};