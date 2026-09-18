import { useLocation, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import MyButton from '../components/MyButton';

const BookingAcceptedPage = () => {
    const location = useLocation();

    if (!location.state || !location.state.booking) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "60px" }}>
                <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center" }}>
                    Δεν υπάρχουν στοιχεία κράτησης.
                </Typography>
                <MyButton component={Link} to="/">
                    Επιστροφή στην αρχική
                </MyButton>
            </Box>
        );
    }

    const { booking } = location.state;

    return (
        <Box
            sx={{
                display: "flex",
                width: "846px",
                padding: "20px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                borderRadius: "15px",
                border: "5px solid #FFF",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
            }}
        >
            <Typography
                sx={{
                    alignSelf: "stretch",
                    color: "black",
                    textAlign: "center",
                    fontSize: "22px",
                    fontWeight: "600",
                }}
            >
                Η κράτηση έγινε με επιτυχία. Σημείωσε τον παρακάτω κωδικό για να μπορέσεις να πληρώσεις στο ταμείο και να μπεις στην εκδήλωση.
                Μπορείς να βρεις αυτόν τον κωδικό και στην σελίδα του προφίλ σου “Κρατήσεις”
            </Typography>

            <Typography 
                sx={{ 
                    fontSize: "28px", 
                    fontWeight: "600", 
                    color: "black", 
                    textAlign: "center" 
                }}
            >
                Αριθμός κράτησης: {booking.id}
            </Typography>

            <MyButton component={Link} to="/">
                Επιστροφή στην αρχική
            </MyButton>
        </Box>
    );
};

export default BookingAcceptedPage;