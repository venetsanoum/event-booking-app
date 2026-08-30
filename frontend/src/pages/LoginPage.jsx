import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, TextField, Button} from "@mui/material";
import MyButton from '../components/MyButton';
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";


const LoginPage = () => {
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

    const [showPassword, setShowPassword] = useState(false);
    
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
            <TextField
                label="Username"
                fullWidth
                required
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Κωδικός"
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
                <Typography fontSize={16}> Δεν έχεις λογαριασμό;</Typography>
                <Button 
                    component={Link}
                    to="/signup-choose-type"
                    sx={{textTransform:"none", fontSize: "16px"}}
                >
                    Κάνε εγγραφή τώρα
                </Button>
            </Box>
            <MyButton
                type="submit"
            >
                Σύνδεση
            </MyButton>
        </Box>
        </>
    );
}

export default LoginPage;