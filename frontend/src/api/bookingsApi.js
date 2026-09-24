import axiosInstance from './axiosInstance';

export const createBooking = (eventId, items) => {
    return axiosInstance.post(`booking/create/${eventId}/`, { items });
};

export const getMyUpcomingBookings = () => {
    return axiosInstance.get('booking/my-upcoming-bookings/');
};

export const getMyCompletedBookings = () => {
    return axiosInstance.get('booking/my-completed-bookings/');
};

export const getMyCancelledBookings = () => {
    return axiosInstance.get('booking/my-cancelled-bookings/');
}

export const getEventBookings = (eventId) => {
    return axiosInstance.get(`booking/event/${eventId}/`);
};