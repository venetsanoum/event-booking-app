import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import '@fontsource/luckiest-guy'
import MyButton from '../components/MyButton';
import { Link } from 'react-router-dom';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from 'react';
import { getMe } from '../api/authApi';

const AccountPage = () => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();
                setUserData(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης λογαριασμού:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των στοιχείων σου.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center", padding: "60px" }}>
                {error}
            </Typography>
        );
    }
    const fields = [
        { label: "Όνομα", value: userData.first_name },
        { label: "Επώνυμο", value: userData.last_name },
        { label: "Username", value: userData.username },
        { label: "Email", value: userData.email },
        { label: "Τηλέφωνο", value: userData.phone },
        { label: "ΑΦΜ", value: userData.afm },
    ];

    return (
        <>
            <Typography
                sx={{
                    color: "black",
                    fontSize: "65px",
                    fontWeight: "600",
                }}
            >
                Λογαριασμός
            </Typography>
            {userData.profile_photo ? (
                <Avatar
                    src={userData.profile_photo}
                    sx={{ width: 100, height: 100, marginBottom: "10px" }}
                />
            ) : (
                <Avatar sx={{ width: 170, height: 170, marginBottom: "10px", bgcolor: "#ccc" }}>
                    <AccountCircleIcon sx={{ fontSize: 170 }} />
                </Avatar>
            )}
            <Box
                sx={{
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
                        {userData.first_name}
                    </Typography>
                </Box>

                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "71px",
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
                        {userData.last_name}
                    </Typography>
                </Box>

                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "108px",
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
                        {userData.email}
                    </Typography>
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "55px",
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
                        {userData.phone}
                    </Typography>
                </Box>                
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "125px",
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
                        {userData.afm}
                    </Typography>
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
                        {userData.username}
                    </Typography>
                </Box>
            </Box>
            <MyButton
                component={Link}
                to={`/account-edit`}
            >
                Επεξεργασία
            </MyButton>
        </>
    );
};
export default AccountPage;