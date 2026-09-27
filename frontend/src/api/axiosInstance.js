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
        // ο έλεγχος if(token) χρειάζεται ώστε στα δημόσια endpoints
        // (π.χ. αναζήτηση από επισκέπτη) να μη σταλεί "Bearer null"
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Όταν έχει λήξει το access token, το ανανεώνει αυτόματα με το refresh token
// και ξαναστέλνει το αρχικό request, ώστε να μη διακοπεί η εμπειρία του χρήστη
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // Το login επιστρέφει 401 όταν τα στοιχεία είναι λάθος.
        // Το αγνοούμε, ώστε να μη θεωρηθεί ληγμένο token και
        // να προλάβει η σελίδα να δείξει το μήνυμα λάθους.
        const isLoginRequest = originalRequest.url.includes('users/login');

        // Το _retry σημαδεύει το request που έχει ήδη ξανασταλεί μία φορά,
        // ώστε να μην μπει σε ατέρμονο βρόχο αν ξαναπάρει 401
        if (error.response && error.response.status === 401 && !isLoginRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            // Χωρίς refresh token δεν υπάρχει τρόπος ανανέωσης: καθαρίζουμε
            // τα στοιχεία σύνδεσης και οδηγούμε τον χρήστη στο login
            if (!refreshToken) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Η ανανέωση γίνεται με σκέτο axios και όχι με το axiosInstance,
                // γιατί αλλιώς ένα 401 στο ίδιο το refresh θα ξαναενεργοποιούσε
                // αυτόν τον interceptor, δημιουργώντας ατέρμονο βρόχο
                const response = await axios.post('https://127.0.0.1:8000/users/refresh/', {
                    refresh: refreshToken
                });
                localStorage.setItem("access_token", response.data.access);
                // ξαναστέλνουμε το αρχικό request, τώρα με το νέο token
                return axiosInstance(originalRequest);
            }
            catch (refreshError) {
                // Απέτυχε και η ανανέωση, άρα έχει λήξει και το refresh token
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;