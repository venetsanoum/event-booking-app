import axiosInstance from './axiosInstance';

export const getInbox = (params) => {
    return axiosInstance.get('messaging/inbox/', { params });
};

export const getSent = (params) => {
    return axiosInstance.get('messaging/sent/', { params });
};

export const getUnreadCount = () => {
    return axiosInstance.get('messaging/unread-count/');
};

export const getMessageDetails = (id) => {
    return axiosInstance.get(`messaging/details/${id}/`);
};

export const sendMessage = (eventId, data) => {
    return axiosInstance.post(`messaging/${eventId}/`, data);
};

export const deleteFromInbox = (id) => {
    return axiosInstance.patch(`messaging/delete/inbox/${id}/`);
};

export const deleteFromSent = (id) => {
    return axiosInstance.patch(`messaging/delete/sent/${id}/`);
};

