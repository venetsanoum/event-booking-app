import { useState, useEffect } from "react";
import { searchEvents } from "../api/eventsApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import SearchCard from "../components/SearchCard";

const SearchPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await searchEvents();
                setEvents(response.data.results);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδηλώσεων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση εκδηλώσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
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
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "40px",
                padding: "40px",
            }}
        >
            <Typography sx={{ color: "black", fontSize: "50px", fontWeight: "600" }}>
                Αναζήτηση Εκδηλώσεων
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    width: "100%",
                    maxWidth: "900px",
                }}
            >
                {events.map((event) => (
                    <SearchCard
                        key={event.id}
                        event_photo={event.main_photo}
                        title={event.title}
                        date_start={new Date(event.startDateTime).toLocaleDateString('el-GR')}
                        date_end={new Date(event.endDateTime).toLocaleDateString('el-GR')}
                        address={`${event.venue}, ${event.city}`}
                        lowest_price={event.lowest_price}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SearchPage;

