import { useState, useEffect } from "react";
import { searchEvents } from "../api/eventsApi";
import { Box, CircularProgress, Typography } from "@mui/material";

const SearchPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await searchEvents();
                setEvents(response.data);
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
        <></>
    )
}

export default SearchPage;

