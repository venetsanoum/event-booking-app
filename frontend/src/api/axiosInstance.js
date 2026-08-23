import axios from 'axios';

const axiosInstance = axios.create({
    // όταν κάνω request με αυτό το instance θα προστίθεται αυτόματα αυτό το κομμάτι στο url
    baseURL: 'http://127.0.0.1:8000/' 
});

export default axiosInstance