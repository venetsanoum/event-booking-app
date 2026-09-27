import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Κρατά τα στοιχεία του συνδεδεμένου χρήστη και τα κάνει διαθέσιμα σε
// όλη την εφαρμογή, ώστε κάθε σελίδα να ξέρει ποιος είναι συνδεδεμένος
// και με ποιον ρόλο, χωρίς να περνάμε props από component σε component.
export function AuthProvider({ children }) {

    // Η αρχική τιμή διαβάζεται από το localStorage, ώστε ο χρήστης να
    // παραμένει συνδεδεμένος και μετά από ανανέωση της σελίδας.
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Αποθηκεύουμε τα tokens και τα βασικά στοιχεία του χρήστη τόσο στο
    // localStorage (για να επιβιώνουν σε refresh) όσο και στο state (για
    // να ενημερωθεί αμέσως η διεπαφή).
    const login = (userData) => {
        localStorage.setItem('access_token', userData.access);
        localStorage.setItem('refresh_token', userData.refresh);
        localStorage.setItem('user', JSON.stringify({
            username: userData.username,
            role: userData.role,
            profile_photo: userData.profile_photo,
        }));
        setUser({
            username: userData.username,
            role: userData.role,
            profile_photo: userData.profile_photo,
        });
    };

    // Χρησιμοποιείται μετά την επεξεργασία προφίλ, ώστε να ενημερωθεί π.χ.
    // η φωτογραφία στη μπάρα πλοήγησης χωρίς να χρειαστεί νέα σύνδεση.
    const updateUser = (newData) => {
        const updated = { ...user, ...newData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Συντόμευση, ώστε τα components να γράφουν useAuth() αντί για useContext(AuthContext)
export function useAuth() {
    return useContext(AuthContext);
}