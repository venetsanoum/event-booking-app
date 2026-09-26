import axiosInstance from './axiosInstance';

export const getAllUsers = () => {
    return axiosInstance.get('users/admin/users/');
};

export const getPendingUsers = () => {
    return axiosInstance.get('users/admin/users/pending/');
};

export const getUserInfo = (id) => {
    return axiosInstance.get(`users/admin/users/${id}/`);
};

export const setUserApproval = (id, status) => {
    return axiosInstance.patch(`users/admin/users/${id}/approval/`, { approval_status: status });
};

export const exportXML = () => {
    return axiosInstance.get('exports/xml/', { responseType: 'blob' });
};

export const exportJSON = () => {
    return axiosInstance.get('exports/json/', { responseType: 'blob' });
};
