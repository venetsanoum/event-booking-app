import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MyButton from "../components/MyButton";
import { getMe } from "../api/authApi";
import { formatEventDateRange } from "../utils/dateUtils";
import { createBooking } from "../api/bookingsApi";

const BookingPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();
                setUserData(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης στοιχείων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των στοιχείων σου.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

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

    if (!location.state || !location.state.event) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "60px" }}>
                <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center" }}>
                    Δεν υπάρχουν τα στοιχεία της εκδήλωσης αυτής της κράτησης.
                </Typography>
                <MyButton component={Link} to="/search">
                    Επιστροφή στην αναζήτηση
                </MyButton>
            </Box>
        );
    }

    const { event, quantities } = location.state;

    const selectedTickets = event.ticket_types.filter((tt) => quantities[tt.id] > 0);


    const handleConfirmBooking = async () => {
        setSubmitting(true);
        setSubmitError('');

        try {
            const items = selectedTickets.map((tt) => ({
                ticket_type: tt.id,
                number: quantities[tt.id],
            }));

            const response = await createBooking(event.id, items);

            navigate('/booking-accepted', { state: { booking: response.data } });
        } catch (err) {
            console.log('Αποτυχία κράτησης:', err);
            setSubmitError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", padding: "40px" }}>
            <Typography sx={{ color: "black", fontSize: "65px", fontWeight: "600" }}>
                Επιβεβαίωση Κράτησης
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    width: "846px",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "39px",
                }}
            >
                <Typography 
                    sx={{ 
                        alignSelf: "stretch",
                        color: "black",
                        fontSize: "46px",
                        fontWeight: "600",
                    }}
                >
                    Στοιχεία Χρήστη
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        padding: "20px 30px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                        borderRadius: "15px",
                        border: "5px solid #fff",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Ονοματεπώνυμο
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {userData.first_name} {userData.last_name}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Τηλέφωνο
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {userData.phone} 
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            E-mail
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {userData.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "846px",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "39px",
                }}
            >
                <Typography 
                    sx={{ 
                        alignSelf: "stretch",
                        color: "black",
                        fontSize: "46px",
                        fontWeight: "600",
                    }}
                >
                    Στοιχεία Κράτησης
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        padding: "20px 30px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                        borderRadius: "15px",
                        border: "5px solid #fff",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Όνομα εκδήλωσης
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {event.title}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Ημερομηνία και Ώρα
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {formatEventDateRange(event.startDateTime, event.endDateTime)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Τοποθεσία
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                color: "black",
                                fontSize: "28px",
                            }}
                        >
                            {event.venue}, {event.city}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingBottom: "15px",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "stretch",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "flex",
                                height: "34px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                alignSelf: "stretch",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",                               
                                color: "black",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            Εισητήρια
                        </Typography>
                        {selectedTickets.map((tt) => (
                            <Typography
                                key={tt.id}
                                sx={{
                                    display: "flex",
                                    padding: "10px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    alignSelf: "stretch",
                                    color: "black",
                                    fontSize: "28px",
                                }}
                            >
                                {tt.name} x {quantities[tt.id]} = {(quantities[tt.id] * tt.price).toFixed(2)}€
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>
            <MyButton 
                onClick={() => setConfirmDialogOpen(true)}
            >
                Επιβεβαίωση Κράτησης
            </MyButton>
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "15px",
                            border: "5px solid #FFF",
                            overflow: "hidden",
                        },
                    },
                }}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        padding: "20px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Typography
                        sx={{
                            width: "434px",
                            color: "black",
                            textAlign: "center",
                            fontSize: "22px",
                            fontWeight: "600",
                        }}
                    >
                        Είσαι σίγουρος/η ότι θέλεις να κάνεις κράτηση; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί
                    </Typography>
                    {submitError && (
                        <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center", marginTop: "10px" }}>
                            {submitError}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Button
                            onClick={() => setConfirmDialogOpen(false)}
                            sx={{
                                color: "black",
                                textDecoration: "underline",
                            }}
                        >
                            Άκυρο
                        </Button>
                        <MyButton
                            onClick={handleConfirmBooking}
                            disabled={submitting}
                        >
                            {submitting ? "Επεξεργασία..." : "Κάνε κράτηση"}
                        </MyButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BookingPage;