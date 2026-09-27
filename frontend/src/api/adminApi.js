// API calls για τις σελίδες του διαχειριστή
import axiosInstance from './axiosInstance';

export const getAllUsers = (params) => {
    return axiosInstance.get('users/admin/users/', { params });
};

export const getPendingUsers = (params) => {
    return axiosInstance.get('users/admin/users/pending/', { params });
};

export const getUserInfo = (id) => {
    return axiosInstance.get(`users/admin/users/${id}/`);
};

// status: "APPROVED" ή "REJECTED"
export const setUserApproval = (id, status) => {
    return axiosInstance.patch(`users/admin/users/${id}/approval/`, { approval_status: status });
};

// Το responseType: 'blob' (binary large object) είναι απαραίτητο ώστε το axios να μη
// μετατρέψει την απάντηση σε κείμενο, αλλά να την κρατήσει ως
// αρχείο που θα κατέβει στον χρήστη.
export const exportXML = () => {
    return axiosInstance.get('exports/xml/', { responseType: 'blob' });
};

export const exportJSON = () => {
    return axiosInstance.get('exports/json/', { responseType: 'blob' });
};
