import { useState } from "react";
import { useEffect } from "react";
import { editMe } from "../api/authApi";
import { getMe } from "../api/authApi";
import { Button, Box, Typography, CircularProgress, TextField, Avatar, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import MyButton from "../components/MyButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Breadcrumbs from "../components/Breadcrumbs";
import { useAuth } from "../context/AuthContext";

const AccountEditPage = () => {

    const[initLoading, setInitLoading] = useState(true);
    const[initError, setInitError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordbar, setShowPasswordbar] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [afmError, setAfmError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        afm: '',
        city: '',
        country: '',
        username: '',
        password: '',
        passwordbar: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await getMe();
                const user = response.data;
                setFormData({
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    afm: user.afm || '',
                    username: user.username || '',
                    city: user.city || '',
                    country: user.country || '',
                    password: '',
                    passwordbar: '',
                });
                setPhotoPreview(user.profile_photo);
            }
            catch (err) {
                console.log('Αποτυχία φόρτωσης λογαριασμού:', err);
                setInitError('Δεν ήταν δυνατή η φόρτωση των στοιχείων σου.');
            } finally {
                setInitLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (initLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (initError) {
        return (
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
                {initError}
            </Typography>
        );
    }

    const hasMinLength = formData.password.length >= 12;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const wantsPasswordChange = formData.password !== '' || formData.passwordbar !== '';

        if(wantsPasswordChange && (formData.password !== formData.passwordbar)) {
            setError("Οι κωδικοί δεν ταιριάζουν.");
            return;
        }

        if(wantsPasswordChange && (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar)) {
            setError("Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.");
            return;
        }

        if(afmError) {
            setError("Διόρθωσε το ΑΦΜ πριν συνεχίσεις.");
            return;
        }

        setLoading(true);

        try {

            const dataToSend = new FormData();
            dataToSend.append('first_name', formData.first_name);
            dataToSend.append('last_name', formData.last_name);
            dataToSend.append('email', formData.email);
            dataToSend.append('phone', formData.phone);
            dataToSend.append('afm', formData.afm);
            dataToSend.append('username', formData.username);
            dataToSend.append('address', formData.address);
            dataToSend.append('city', formData.city);
            dataToSend.append('country', formData.country);

            if (wantsPasswordChange) {
                dataToSend.append('password', formData.password);
                dataToSend.append('passwordbar', formData.passwordbar);
            }

            if (photoFile) {
                dataToSend.append('profile_photo', photoFile);
            }

            const response = await editMe(dataToSend);
            updateUser({
                username: response.data.username,
                profile_photo: response.data.profile_photo,
            });
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/account');
            }, 1000);
        }
        catch (err) {
            console.log('Αποτυχία ενημέρωσης:', err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                const message = data.detail || Object.values(data)[0];
                setError(Array.isArray(message) ? message[0] : message);
            } else {
                setError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
            }
        } finally {
            setLoading(false);
        }
    } 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };  
    

    return (
        <>
        <Breadcrumbs 
            items={[
                { label: "Το προφίλ μου", to: "/account" },
                { label: "Επεξεργασία"}
            ]} 
            sx={{
                marginLeft: "-30px",
                marginTop: "-110px",
            }}
        />
            <Typography
                sx={{
                    color: "black",
                    fontSize: "65px",
                    fontWeight: "600",
                }}
            >
                Επεξεργασία Προφίλ
            </Typography>
            {photoPreview ? (
                <Avatar
                    src={photoPreview}
                    sx={{ width: 170, height: 170, marginBottom: "10px" }}
                />
            ) : (
                <Avatar sx={{ width: 170, height: 170, marginBottom: "10px", bgcolor: "#ccc" }}>
                    <AccountCircleIcon sx={{ fontSize: 170 }} />
                </Avatar>
            )}
            <MyButton component="label">
                Αλλαγή φωτογραφίας
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoChange}
                />
            </MyButton>
            <Box
                component="form"
                id="edit-account-form"
                onSubmit={handleSubmit}
                sx={{
                    width: "680px",
                    display: "flex",
                    padding: "20px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "13px",
                    borderRadius: "15px",
                    border: "5px solid #fff",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)"
                }}
            >
                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "18px" }}>
                        {error}
                    </Typography>
                )}
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "101px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                                Όνομα
                    </Typography>
                    <TextField
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>

                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "66px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                                Επώνυμο
                    </Typography>
                    <TextField
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>

                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "130px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                        E-mail
                    </Typography>
                    <TextField
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "59px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                                Τηλέφωνο
                    </Typography>
                    <TextField 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>                
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "58px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                        Διεύθυνση
                    </Typography>
                    <TextField 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>     
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "121px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                        Πόλη
                    </Typography>
                    <TextField 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>  
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "115px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                        Χώρα
                    </Typography>
                    <TextField 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>  
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "121px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                        ΑΦΜ
                    </Typography>
                    <TextField 
                        name="afm"
                        value={formData.afm}
                        onChange={handleAfmChange}
                        error={!!afmError}
                        helperText={afmError}
                        fullWidth
                        slotProps={{ htmlInput: { maxLength: 10 } }}
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>             
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "60px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                                Username
                    </Typography>
                    <TextField 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "75px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    >
                                Νέος Κωδικός
                    </Typography>
                    <TextField 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        onFocus={() => setShowPasswordRules(true)}
                        onBlur={() => setShowPasswordRules(false)}
                        fullWidth
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
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                        {showPasswordRules && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "1070px",
                                    left: "420px",
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
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0px",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                    }}
                
                >
                    <Typography 
                        sx={{ 
                            display: "flex",
                            padding: "5px 0",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            marginLeft: "-10px"
                        }}
                    >
                                Επαλήθευση Νέου Κωδικού
                    </Typography>
                    <TextField 
                        name="passwordbar"
                        fullWidth
                        value={formData.passwordbar}
                        onChange={handleChange}
                        type={showPasswordbar ? "text" : "password"}
                        slotProps={{
                            input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton onClick={() => setShowPasswordbar(!showPasswordbar)} edge="end">
                                    {showPasswordbar ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            ),
                            },
                        }}
                        sx={{ 
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                        }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                }}
            >
                <Button 
                    component={Link}
                    to="/account"
                    sx={{ 
                        color: "black", 
                        textTransform: "none",
                        fontSize: "24px",
                        "&:hover": { color: "#363636", textDecoration: "underline" },
                        textDecoration: "underline"
                    }}
                    >
                    Ακύρωση
                </Button>               
                <MyButton
                    type="submit"
                    form="edit-account-form"
                    disabled={loading}
                >
                    {loading ? "Αποθήκευση..." : "Αποθήκευση"}
                </MyButton>
            </Box>
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ fontSize: "18px" }}>
                    Τα στοιχεία ενημερώθηκαν με επιτυχία!
                </Alert>
            </Snackbar>
        </>
    );
};
export default AccountEditPage;