import axiosInstance from './axiosInstance';

export const createBooking = (eventId, items) => {
    return axiosInstance.post(`booking/create/${eventId}/`, { items });
};

export const getMyUpcomingBookings = (params) => {
    return axiosInstance.get('booking/my-upcoming-bookings/', { params });
};

export const getMyCompletedBookings = (params) => {
    return axiosInstance.get('booking/my-completed-bookings/', { params });
};

export const getMyCancelledBookings = (params) => {
    return axiosInstance.get('booking/my-cancelled-bookings/', { params });
}

export const getEventBookings = (eventId) => {
    return axiosInstance.get(`booking/event/${eventId}/`);
};