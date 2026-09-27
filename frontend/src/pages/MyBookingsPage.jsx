import { useState, useEffect } from "react";
import { Pagination, Box, Typography, CircularProgress, Tabs, Tab } from "@mui/material";
import { formatEventDateRange } from "../utils/dateUtils";
import { getMyUpcomingBookings, getMyCompletedBookings, getMyCancelledBookings } from "../api/bookingsApi";
import Breadcrumbs from "../components/Breadcrumbs";

const PAGE_SIZE = 10;

const tabConfig = [
    { label: "Ενεργές", fetchFn: getMyUpcomingBookings },
    { label: "Παρελθοντικές", fetchFn: getMyCompletedBookings },
    { label: "Ακυρωμένες", fetchFn: getMyCancelledBookings },
];

const MyBookingsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await tabConfig[activeTab].fetchFn({
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

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        fetchBookings();
    }, [activeTab, page]);

    return (
        <>
            <Breadcrumbs 
                items={[
                    { label: "Οι κρατήσεις μου" }
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
                Κρατήσεις
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    width: "905px",
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        display: "flex",
                        width: "520px",
                        padding: "10px",
                        alignItems: "center",
                        gap: "5px",
                        borderRadius: "15px",
                        border: "2px solid  #FFF",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                        "& .MuiTab-root": { fontSize: "24px", textTransform: "none" },
                    }}
                >
                    {tabConfig.map((tab) => (
                        <Tab key={tab.label} label={tab.label} />
                    ))}
                </Tabs>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <Typography sx={{ textAlign: "center", color: "#000", fontSize: "24px" }}>
                        Δεν υπάρχουν κρατήσεις σε αυτή την κατηγορία.
                    </Typography>
                )}

                {!loading && !error && bookings.map((booking) => {
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
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "22px",
                                    fontWeight: "600",
                                    color: "black",
                                    textAlign: "left",
                                }}
                            >
                                Κωδικός κράτησης: {booking.id}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    height: "300px",
                                    padding: "20px 30px",
                                    alignItems: "center",
                                    gap: "30px",
                                    borderRadius: "15px",
                                    border: "5px solid #FFF",
                                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "179px",
                                        height: "253px",
                                        flexShrink: 0,
                                        backgroundImage: booking.event.main_photo ? `url(${booking.event.main_photo})` : "none",
                                        backgroundColor: "#ddd",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        borderRadius: "10px",
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignSelf: "stretch",
                                        justifyContent: "center",
                                        flex: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                            color: "black",
                                            fontSize: "28px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {booking.event.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#201984",
                                            fontSize: "24px",
                                            fontWeight: "500",
                                            textAlign: "left",
                                            paddingLeft: "5px",
                                        }}
                                    >
                                        {formatEventDateRange(booking.event.startDateTime, booking.event.endDateTime)}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "black",
                                            fontSize: "22px",
                                            fontWeight: "500",
                                            textAlign: "left",
                                            padding: "20px 10px",
                                        }}
                                    >
                                        Τοποθεσία: {booking.event.venue}, {booking.event.city} <br />
                                        Αριθμός εισιτηρίων: {totalTickets} <br />
                                        Συνολική τιμή: {totalPrice.toFixed(2)}€
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
                {count > PAGE_SIZE && (
                    <Pagination
                        count={Math.ceil(count / PAGE_SIZE)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontSize: "18px",
                                color: "black",
                                background: "rgba(255, 255, 255, 0.75)",
                            },
                        }}
                    />
                )}
            </Box>
        </>
    );
};

export default MyBookingsPage;