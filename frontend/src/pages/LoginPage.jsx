import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
        const response = await loginUser(username, password);
        login(response.data);
        console.log('Login επιτυχές:', response.data);
        } catch (err) {
        console.log('Login απέτυχε:', err);
        setError('Λάθος στοιχεία ή δεν έχεις εγκριθεί ακόμα.');
        }
    };

    return (
        <NavBar>
            
        </NavBar>
    );
}

export default LoginPage;