import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, TextField, Button, IconButton, Tooltip, InputAdornment, FormControlLabel, Checkbox, FormGroup} from "@mui/material";
import MyButton from '../components/MyButton';
import { Visibility, VisibilityOff, InfoOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";


const SignupPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        afm: '',
        role: 'ATTENDEE',
        city: '',
        country: '',
        username: '',
        password: '',
        password2: '',
    });
    
    const [afmError, setAfmError] = useState("");
    const handleAfmChange = (e) => {
        const value = e.target.value;
        // Επιτρέπει μόνο αριθμούς
        if (value === "" || /^\d+$/.test(value)) {
            setFormData({
                ...formData,
                afm: value
            });
            if (value.length !== 9 && value.length > 0) {
                setAfmError("Το ΑΦΜ πρέπει να έχει ακριβώς 9 ψηφία");
            } else {
                setAfmError("");
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const hasMinLength = formData.password.length >= 12;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOrganizerChange = (e) => {
        let newRole = "ATTENDEE";
        if(e.target.checked === false) {
            newRole = "ATTENDEE";
        }
        else {
            newRole = "ORGANIZER";
        }
        setFormData({
            ...formData,
            role: newRole
        });
    };

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(formData.password !== formData.password2) {
            setError("Οι κωδικοί δεν ταιριάζουν.");
            return;
        }

        if(!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            setError("Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.");
            return;
        }

        if(afmError) {
            setError("Διόρθωσε το ΑΦΜ πριν συνεχίσεις.");
            return;
        }

        setLoading(true);

        try {
            const { password2, ...dataToSend } = formData;

            const response = await signupUser(dataToSend);
            console.log("Εγγραφή επιτυχής:", response.data);
        }
        catch (err) {
            console.log('Signup απέτυχε:', err);
            setError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
            <Typography
                sx={{
                    color: "black",
                    fontSize: "65px",
                    fontWeight: "600",
                }}
            >
                Εγγραφή
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    padding: "30px 60px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "30px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "top",
                        gap: "50px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "300px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "45px",
                        }}
                    >
                        <TextField
                            label="Όνομα"
                            name="first_name"
                            fullWidth
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Επώνυμο"
                            name="last_name"
                            fullWidth
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Τηλέφωνο"
                            name="phone"
                            fullWidth
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <TextField
                            label="ΑΦΜ"
                            name="afm"
                            fullWidth
                            required
                            error={!!afmError}
                            helperText={afmError}
                            value={formData.afm}
                            onChange={handleAfmChange}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 9
                                },
                                formHelperText: {
                                    sx: { minHeight: "20px", margin: 0 },
                                },
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "300px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "45px",
                        }}
                    >
                        <TextField
                            label="Διεύθυνση"
                            name="address"
                            fullWidth
                            required
                            value={formData.address}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Κωδικός"
                            type={showPassword ? "text" : "password"}
                            onFocus={() => setShowPasswordRules(true)}
                            onBlur={() => setShowPasswordRules(false)}
                            name="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleChange}
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
                        {showPasswordRules && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "520px",
                                    left: "520px",
                                    width: "100",
                                    padding: "12px",
                                    borderRadius: "15px",
                                    border: "5px solid #FFF",
                                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.90) 22.6%, rgba(233, 255, 255, 0.90) 100%)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                }}
                            >
                                <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 1 }}>
                                    Ο κωδικός πρέπει να έχει:
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
                                    <Box sx={{ color: hasMinLength ? "green" : "red" }}>
                                        {hasMinLength ? "✓" : "✗"}
                                    </Box>
                                    <Typography sx={{ fontSize: "16px", color: hasMinLength ? "green" : "red" }}>
                                        Τουλάχιστον 12 χαρακτήρες
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
                                    <Box sx={{ color: hasUpperCase ? "green" : "red" }}>
                                        {hasUpperCase ? "✓" : "✗"}
                                    </Box>
                                    <Typography sx={{ fontSize: "16px", color: hasUpperCase ? "green" : "red" }}>
                                        Τουλάχιστον ένα κεφαλαίο γράμμα
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
                                    <Box sx={{ color: hasNumber ? "green" : "red" }}>
                                        {hasNumber ? "✓" : "✗"}
                                    </Box>
                                    <Typography sx={{ fontSize: "16px", color: hasNumber ? "green" : "red" }}>
                                        Τουλάχιστον έναν αριθμό
                                    </Typography>
                                    </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Box sx={{ color: hasSpecialChar ? "green" : "red" }}>
                                        {hasSpecialChar ? "✓" : "✗"}
                                    </Box>
                                    <Typography sx={{ fontSize: "16px", color: hasSpecialChar ? "green" : "red" }}>
                                        Τουλάχιστον έναν ειδικό χαρακτήρα (!@#$%^&*)
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <TextField
                            label="Επαλήθευση κωδικού"
                            name="password2"
                            fullWidth
                            required
                            value={formData.password2}
                            onChange={handleChange}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "5px",
                            }}
                        >
                        <FormGroup
                            sx={{
                                height: "56px",
                                color: "#6e6e6e",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.role === "ORGANIZER"}
                                        onChange={handleOrganizerChange}
                                    />
                                }
                                label="Διοργανωτής"
                            />
                        </FormGroup>
                        <Tooltip
                            title="Πάτησέ το μόνο αν θέλεις να διοργανώνεις και εκδηλώσεις"
                            arrow
                            placement="top"
                        >
                            <InfoOutlined sx={{ fontSize: "18px", color: "#6e6e6e", cursor: "help", marginTop: "15px"}} />
                        </Tooltip>
                        </Box>
                    </Box>
                </Box>
                <MyButton>
                    Εγγραφή
                </MyButton>
            </Box>
        </>
    );
}

export default SignupPage;