import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import '@fontsource/luckiest-guy'
import MyButton from '../components/MyButton';
import { Link } from 'react-router-dom';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from 'react';
import { getMe } from '../api/authApi';
import Breadcrumbs from '../components/Breadcrumbs';

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
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
                {error}
            </Typography>
        );
    }

    return (
        <>
            <Breadcrumbs 
                items={[
                    { label: "Το προφίλ μου" }
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
                Το προφίλ μου
            </Typography>
            {userData.profile_photo ? (
                <Avatar
                    src={userData.profile_photo}
                    sx={{ width: 170, height: 170, marginBottom: "10px" }}
                />
            ) : (
                <Avatar sx={{ width: 170, height: 170, marginBottom: "10px", bgcolor: "#ccc" }}>
                    <AccountCircleIcon sx={{ fontSize: 170 }} />
                </Avatar>
            )}
            <Box
                sx={{
                    width: "650px",
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
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                        Όνομα
                    </Typography>
                    <Typography
                        sx={{
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                        {userData.first_name}
                    </Typography>
                </Box>
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                                Επώνυμο
                    </Typography>
                    <Typography 
                    sx={{
                        padding: "5px 10px",
                        color: "black",
                        fontSize: "26px",
                        fontWeight: "400",
                        textAlign: "left",
                    }}
                    >
                        {userData.last_name}
                    </Typography>
                </Box>

                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
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
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
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
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                                Διεύθυνση
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
                        {userData.address}
                    </Typography>
                </Box>     
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                                Πόλη
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
                        {userData.city}
                    </Typography>
                </Box>     
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
                        }}
                    >
                                Χώρα
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
                        {userData.country}
                    </Typography>
                </Box>              
                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
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
                        alignSelf: "stretch", 
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                    }}
                >
                    <Typography
                        sx={{
                            width: "220px",
                            flexShrink: 0,
                            padding: "5px 10px",
                            color: "black",
                            fontSize: "26px",
                            fontWeight: "400",
                            textAlign: "left",
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