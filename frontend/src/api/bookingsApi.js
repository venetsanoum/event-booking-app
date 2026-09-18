import axiosInstance from './axiosInstance';

export const createBooking = (eventId, items) => {
    return axiosInstance.post(`booking/create/${eventId}/`, { items });
};