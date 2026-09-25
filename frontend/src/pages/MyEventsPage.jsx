import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Tabs, Tab, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import MyButton from "../components/MyButton";
import { formatEventDateRange } from "../utils/dateUtils";
import { getMyEvents, getMyCompletedEvents, getMyCancelledEvents, getMyDraftedEvents } from "../api/eventsApi";
import Breadcrumbs from "../components/Breadcrumbs";

const tabConfig = [
    { label: "Ενεργές", fetchFn: getMyEvents },
    { label: "Παρελθοντικές", fetchFn: getMyCompletedEvents },
    { label: "Ακυρωμένες", fetchFn: getMyCancelledEvents },
    { label: "Σε επεξεργασία", fetchFn: getMyDraftedEvents },
];

const MyEventsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await tabConfig[activeTab].fetchFn();
                const results = response.data.results || response.data;
                setEvents(results);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδηλώσεων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση εκδηλώσεων.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [activeTab]);

    return (
        <>
            <Breadcrumbs 
                items={[
                    { label: "Οι εκδηλώσεις μου" }
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
                    fontWeight: "600" 
                }}
            >
                Οι εκδηλώσεις μου
            </Typography>

            <Box 
                sx={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    width: "905px",
                    flexDirection: "column",
                    gap: "50px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch",
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            display: "flex",
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
                    <IconButton
                        component={Link}
                        to="/my-events/new"
                        sx={{ 
                            background: "#FFF", 
                            borderRadius: "10px", 
                            width: "73px", 
                            height: "73px",
                            borderRadius: "10px",
                            border: "1px solid #fff",
                            background: "#FFF",
                            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "24px" }}>
                        {error}
                    </Typography>
                )}
                {!loading && !error && (
                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "flex-start",
                            gap: "40px",
                            alignSelf: "stretch",
                        }}
                    >
                        {events.length === 0 ? (
                            <Typography 
                                sx={{ 
                                    textAlign: "center", 
                                    color: "#000", 
                                    fontSize: "24px" 
                                }}
                            >
                                Δεν υπάρχουν εκδηλώσεις σε αυτή την κατηγορία.
                            </Typography>
                        ) : (
                            events.map((event) => (
                            <Box
                                key={event.id}
                                sx={{
                                    display: "flex",
                                    height: "361px",
                                    padding: "20px 30px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "30px",
                                    alignSelf: "stretch",
                                    borderRadius: "15px",
                                    border: "5px solid #FFF",
                                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundImage: event.images && event.images.length > 0 ? `url(${event.images[0].photo})` : "none",
                                        backgroundColor: "#ddd",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        width: "179px",
                                        height: "253px",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "8px",
                                        flex: "1 0 0",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "flex-start",
                                            alignSelf: "stretch",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                                color: "black",
                                                justifyContent: "center",
                                                fontSize: "28px",
                                                fontWeight: "500",
                                                alignSelf: "stretch",
                                            }}
                                        >
                                            {event.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "#201984",
                                                textAlign: "start",
                                                paddingLeft: "5px",
                                                fontSize: "28px",
                                                fontWeight: "500",
                                                alignSelf: "stretch",
                                            }}
                                        >
                                            {formatEventDateRange(event.startDateTime, event.endDateTime)}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                padding: "20px 10px",
                                                justifyContent: "flex-start",
                                                alignSelf: "flex-start",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "#000",
                                                    fontSize: "28px",
                                                    fontWeight: "500",
                                                    textAlign: "left",
                                                }}
                                            >
                                                Τοποθεσία: {event.venue}, {event.city} <br/>
                                                Απομένουν {event.capacity - event.reserved} θέσεις
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: "16px" }}>
                                        <MyButton
                                            component={Link}
                                            to={event.status === "DRAFT" ? `/my-events/${event.id}/edit` : `/my-events/${event.id}`}
                                        >
                                            {event.status === "DRAFT" ? "Επεξεργασία" : "Περισσότερα"}
                                        </MyButton>
                                        {event.status !== "DRAFT" && (
                                            <MyButton component={Link} to={`/my-events/${event.id}/bookings`}>
                                                Κρατήσεις
                                            </MyButton>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        ))
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
};

export default MyEventsPage;