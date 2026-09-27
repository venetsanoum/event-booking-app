// API calls για τις εκδηλώσεις 
import axiosInstance from './axiosInstance';

// Αναζήτηση εκδηλώσεων με φίλτρα
export const searchEvents = (filters = {}) => {
    // Κρατάμε μόνο τα φίλτρα που έχουν πραγματική τιμή. Αν στέλναμε
    // κενά πεδία (π.χ. from_date=), το backend θα προσπαθούσε να
    // φιλτράρει με άδεια τιμή και θα έβγαζε λάθος αποτελέσματα.
    const cleanedFilters = {};
    Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
            cleanedFilters[key] = value;
        }
    });
    return axiosInstance.get('events/search/', {
        params: cleanedFilters,
        // Τα φίλτρα κατηγορίας και πόλης είναι πίνακες. Χωρίς αυτή τη
        // ρύθμιση το axios τα στέλνει ως category[]=1, μορφή που το
        // django-filter δεν αναγνωρίζει. Με indexes: null στέλνονται
        // ως category=1&category=2, όπως τα περιμένει το backend.
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

export const getMyEvents = (params) => {
    return axiosInstance.get('events/my-events/', { params });
};

export const getMyCompletedEvents = (params) => {
    return axiosInstance.get('events/my-completed-events/', { params });
};

export const getMyCancelledEvents = (params) => {
    return axiosInstance.get('events/my-cancelled-events/', { params });
};

export const getMyDraftedEvents = (params) => {
    return axiosInstance.get('events/my-drafted-events/', { params });
};

export const createDraftEvent = (data) => {
    return axiosInstance.post('events/draft-event/', data);
};

// Το ίδιο URL εξυπηρετεί και την ανάγνωση των στοιχείων (GET)
// και την αποθήκευση των αλλαγών (PATCH)
export const getEventForEdit = (id) => {
    return axiosInstance.get(`events/${id}/edit/`);
};

export const editEvent = (id, data) => {
    return axiosInstance.patch(`events/${id}/edit/`, data);
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
export const editTicketType = (eventId, ticketId, data) => {
    return axiosInstance.patch(`events/${eventId}/ticket-types/${ticketId}/`,data);
};

export const getRecommendations = () => {
    return axiosInstance.get('recommendation/');
};

export const deleteEvent = (id) => {
    return axiosInstance.delete(`events/${id}/edit/`);
};

export const deleteTicketType = (eventId, ticketId) => {
    return axiosInstance.delete(`events/${eventId}/delete-ticket-types/${ticketId}/`);
};