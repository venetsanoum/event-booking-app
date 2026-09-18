import axios from 'axios';

const axiosInstance = axios.create({
    // όταν κάνω request με αυτό το instance θα προστίθεται αυτόματα αυτό το κομμάτι στο url
    baseURL: 'https://127.0.0.1:8000/' 
});

// interceptor που καλείται πριν απο κάθε request
// στέλνει το access token του χρήστη που είναι συνδεδεμένος
axiosInstance.interceptors.request.use( 
    (config) => {
        const token = localStorage.getItem("access_token");
        if(token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Όταν έχει λήξει το access token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if(error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem("refresh_token");
            if(!refreshToken) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }
            else {
                try{
                    const response = await axios.post('http://127.0.0.1:8000/users/token/refresh', { 
                        refresh: refreshToken
                    });
                    localStorage.setItem("access_token", response.data.access);
                    return axiosInstance(error.config);
                }
                catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance