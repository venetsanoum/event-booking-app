import axiosInstance from './axiosInstance';

export const searchEvents = (filters = {}) => {
    const cleanedFilters = {};
    Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
            cleanedFilters[key] = value;
        }
    });
    return axiosInstance.get('events/search/', { params: cleanedFilters });
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