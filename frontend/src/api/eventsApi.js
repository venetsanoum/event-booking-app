import axiosInstance from './axiosInstance';

export const searchEvents = () => {
    return axiosInstance.get('search/');
};