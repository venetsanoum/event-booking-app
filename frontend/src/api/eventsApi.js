import axiosInstance from './axiosInstance';

export const searchEvents = (filters = {}) => {
    return axiosInstance.get('events/search/', { params: filters });
};

export const getCategories = () => {
    return axiosInstance.get('events/category-list/');
};

export const getCities = () => {
    return axiosInstance.get('events/cities/');
};

export const getEventDetails = (id) => {
    return axiosInstance.get(`events/details/${id}/`);
};