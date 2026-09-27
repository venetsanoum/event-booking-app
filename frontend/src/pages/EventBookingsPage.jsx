import { useState, useEffect } from "react";
import { Box, Pagination, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { getEventBookings } from "../api/bookingsApi";
import { getEventPreview } from "../api/eventsApi";

const PAGE_SIZE = 10;

const EventBookingsPage = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventPreview(id);
                setEvent(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδήλωσης:', err);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getEventBookings(id, {
                    limit: PAGE_SIZE,
                    offset: (page - 1) * PAGE_SIZE,
                });
                setBookings(response.data.results || response.data);
                setCount(response.data.count || 0);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης κρατήσεων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των κρατήσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [id, page]);

    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, eventRes] = await Promise.all([
                    getEventBookings(id),
                    getEventPreview(id),
                ]);
                setBookings(bookingsRes.data.results || bookingsRes.data);
                setEvent(eventRes.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των κρατήσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "50px",
            }}
        >
            <Breadcrumbs
                items={[
                    { label: "Οι εκδηλώσεις μου", to: "/my-events" },
                    { label: event?.title || "Εκδήλωση", to: `/my-events/${id}` },
                    { label: "Κρατήσεις" },
                ]}
                sx={{
                    marginLeft: "-90px",
                    marginTop: "-110px",
                }}
            />
            {event && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        width: "905px",
                        padding: "20px 30px",
                        borderRadius: "15px",
                        border: "5px solid #FFF",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Typography sx={{ fontSize: "28px", fontWeight: "600", color: "black" }}>
                        Πληροφορίες εισιτηρίων
                    </Typography>

                    {event.ticket_types.map((tt) => (
                        <Box
                            key={tt.id}
                            sx={{
                                display: "flex",
                                padding: "10px 15px",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: "5px",
                                border: "1px solid #FFF",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                            }}
                        >
                            <Typography sx={{ fontSize: "20px", color: "black", textAlign: "left" }}>
                                {tt.name} <br />
                                {tt.price}€
                            </Typography>
                            <Typography sx={{ fontSize: "18px", color: "black", textAlign: "center" }}>
                                Συνολικά <br />
                                {tt.quantity}
                            </Typography>
                            <Typography sx={{ fontSize: "18px", color: "black", textAlign: "center" }}>
                                Κρατήσεις <br />
                                {tt.quantity - tt.available}
                            </Typography>
                            <Typography sx={{ fontSize: "18px", color: "black", textAlign: "center" }}>
                                Απομένουν <br />
                                {tt.available}
                            </Typography>
                        </Box>
                    ))}

                    <Typography sx={{ fontSize: "22px", fontWeight: "600", color: "black" }}>
                        Συνολικές Κρατήσεις: {event.reserved}&nbsp;&nbsp;&nbsp;
                        Απομένουν: {event.capacity - event.reserved}
                    </Typography>
                </Box>
            )}
            <Typography
                sx={{
                    color: "black",
                    fontSize: "45px",
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
                    <Typography sx={{ textAlign: "center", color: "#000", fontSize: "22px" }}>
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
                            Σύνολο κρατήσεων: {count} &nbsp;&nbsp;
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
                {count > PAGE_SIZE && (
                    <Pagination
                        count={Math.ceil(count / PAGE_SIZE)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        sx={{
                            alignSelf: "center",
                            "& .MuiPaginationItem-root": {
                                fontSize: "18px",
                                color: "black",
                                background: "rgba(255, 255, 255, 0.75)",
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default EventBookingsPage;