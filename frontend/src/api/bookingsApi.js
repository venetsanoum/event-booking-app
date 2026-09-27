// API calls για τις κρατήσεις
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

// Οι κρατήσεις για κάποιο συγκεκριμένο event
export const getEventBookings = (eventId, params) => {
    return axiosInstance.get(`booking/event/${eventId}/`, { params });
};