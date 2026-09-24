import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, TextField, Button, IconButton, InputAdornment} from "@mui/material";
import MyButton from '../components/MyButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // για να μην κάνει ο χρήστης double submit
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await loginUser(username.trim(), password.trim());
            login(response.data);
            console.log('Login επιτυχές:', response.data);
            if (location.state && location.state.from) {
                navigate(location.state.from, { state: location.state.bookingData });
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log('Login απέτυχε:', err);
            if (err.response && err.response.status === 401) {
                setError('Λάθος στοιχεία ή δεν έχεις εγκριθεί ακόμα.');
            } else if (err.response && err.response.data) {
                const data = err.response.data;
                const message = data.detail || Object.values(data)[0];
                setError(Array.isArray(message) ? message[0] : message);
            } else {
                setError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
            }
        }finally {
            setLoading(false);
        }
    };

    
    return (
        <>
        <Typography
            sx={{
                color: "black",
                fontSize: "65px",
                fontWeight: "600",
            }}
        >
            Σύνδεση
        </Typography>
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "570px",
                display: "flex",
                padding: "30px 60px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                borderRadius: "15px",
                border: "5px solid #FFF",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
            }}
        >
            {error && (
                <Typography sx={{ color: "#d32f2f", fontSize: "18px" }}>
                    {error}
                </Typography>
            )}
            <TextField
                label="Username"
                name="username"
                autoComplete="username" //για password managers
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Κωδικός"
                name="password"
                autoComplete="current-password"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                    input: {
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
            />
            
            <Box
                sx={{
                    display:"flex",
                    alignItems:"center"
                }}
            >
                <Typography sx={{fontSize: "18px"}}> Δεν έχεις λογαριασμό;</Typography>
                <Button 
                    component={Link}
                    to="/signup"
                    sx={{textTransform:"none", fontSize: "16px"}}
                >
                    Κάνε εγγραφή τώρα
                </Button>
            </Box>
            <MyButton
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
            >
                {loading ? "Σύνδεση..." : "Σύνδεση"}
            </MyButton>
        </Box>
        </>
    );
}

export default LoginPage;