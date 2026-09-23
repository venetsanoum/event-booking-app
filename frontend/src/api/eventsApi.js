import axiosInstance from './axiosInstance';

export const searchEvents = (filters = {}) => {
    const cleanedFilters = {};
    Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
            cleanedFilters[key] = value;
        }
    });
    return axiosInstance.get('events/search/', {
        params: cleanedFilters,
        paramsSerializer: { indexes: null },
    });
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

export const getMyEvents = () => {
    return axiosInstance.get('events/my-events/');
};

export const getMyCompletedEvents = () => {
    return axiosInstance.get('events/my-completed-events/');
};

export const getMyCancelledEvents = () => {
    return axiosInstance.get('events/my-cancelled-events/');
};

export const getMyDraftedEvents = () => {
    return axiosInstance.get('events/my-drafted-events/');
};

export const createDraftEvent = (data) => {
    return axiosInstance.post('events/draft-event/', data);
};

export const editEvent = (id, data) => {
    return axiosInstance.patch(`events/${id}/edit/`, data);
};

export const getEventForEdit = (id) => {
    return axiosInstance.get(`events/${id}/edit/`);
};

export const createTicketType = (eventId, data) => {
    return axiosInstance.post(`events/${eventId}/ticket-types/`, data);
};

export const uploadEventImage = (eventId, formData) => {
    return axiosInstance.post(`events/${eventId}/images/`, formData);
};

export const publishEvent = (eventId) => {
    return axiosInstance.post(`events/${eventId}/publish/`);
};

export const getEventPreview = (id) => {
    return axiosInstance.get(`events/${id}/preview/`);
};

export const cancelEvent = (id) => {
    return axiosInstance.post(`events/${id}/cancel/`);
};