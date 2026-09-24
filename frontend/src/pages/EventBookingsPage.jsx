import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { getEventBookings } from "../api/bookingsApi";

const EventBookingsPage = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getEventBookings(id);
                setBookings(response.data.results || response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης κρατήσεων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των κρατήσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [id]);

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

    const eventTitle = bookings.length > 0 ? bookings[0].event.title : '';

    const totalTicketsSold = bookings.reduce(
        (sum, booking) => sum + booking.items.reduce((s, item) => s + item.number, 0),
        0
    );

    return (
        <>
            <Breadcrumbs
                items={[
                    { label: "Οι εκδηλώσεις μου", to: "/my-events" },
                    { label: "Κρατήσεις" },
                ]}
                sx={{
                    marginLeft: "-30px",
                    marginTop: "-120px",
                }}
            />

            <Typography
                sx={{
                    color: "black",
                    fontSize: "65px",
                    fontWeight: "600",
                }}
            >
                Κρατήσεις
            </Typography>

            {eventTitle && (
                <Typography
                    sx={{
                        color: "black",
                        fontSize: "28px",
                        fontWeight: "500",
                    }}
                >
                    {eventTitle}
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "905px",
                }}
            >
                {bookings.length === 0 ? (
                    <Typography sx={{ textAlign: "center", color: "#777", fontSize: "18px" }}>
                        Δεν υπάρχουν κρατήσεις για αυτή την εκδήλωση.
                    </Typography>
                ) : (
                    <>
                        <Typography
                            sx={{
                                fontSize: "22px",
                                fontWeight: "600",
                                color: "black",
                                textAlign: "left",
                            }}
                        >
                            Σύνολο κρατήσεων: {bookings.length} &nbsp;&nbsp;
                            Σύνολο εισιτηρίων: {totalTicketsSold}
                        </Typography>

                        {bookings.map((booking) => {
                            const totalTickets = booking.items.reduce((sum, item) => sum + item.number, 0);
                            const totalPrice = booking.items.reduce(
                                (sum, item) => sum + item.number * parseFloat(item.ticket_price),
                                0
                            );

                            return (
                                <Box
                                    key={booking.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        padding: "20px 30px",
                                        borderRadius: "15px",
                                        border: "5px solid #FFF",
                                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                            color: "black",
                                            fontSize: "24px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Κωδικός κράτησης: {booking.id}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ width: "200px", flexShrink: 0, fontSize: "20px", color: "black", textAlign: "left" }}>
                                            Ονοματεπώνυμο
                                        </Typography>
                                        <Typography sx={{ fontSize: "20px", color: "black", textAlign: "left" }}>
                                            {booking.attendee.first_name} {booking.attendee.last_name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ width: "200px", flexShrink: 0, fontSize: "20px", color: "black", textAlign: "left" }}>
                                            E-mail
                                        </Typography>
                                        <Typography sx={{ fontSize: "20px", color: "black", textAlign: "left" }}>
                                            {booking.attendee.email}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                        <Typography sx={{ width: "200px", flexShrink: 0, fontSize: "20px", color: "black", textAlign: "left" }}>
                                            Εισιτήρια
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            {booking.items.map((item, index) => (
                                                <Typography key={index} sx={{ fontSize: "20px", color: "black", textAlign: "left" }}>
                                                    {item.ticket_name} x {item.number} = {(item.number * item.ticket_price).toFixed(2)}€
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ width: "200px", flexShrink: 0, fontSize: "20px", fontWeight: "600", color: "black", textAlign: "left" }}>
                                            Σύνολο
                                        </Typography>
                                        <Typography sx={{ fontSize: "20px", fontWeight: "600", color: "black", textAlign: "left" }}>
                                            {totalTickets} εισιτήρια — {totalPrice.toFixed(2)}€
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </>
                )}
            </Box>
        </>
    );
};

export default EventBookingsPage;