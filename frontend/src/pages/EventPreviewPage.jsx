import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useParams } from 'react-router-dom';
import { getEventPreview } from "../api/eventsApi";
import MyButton from "../components/MyButton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatEventDateRange } from "../utils/dateUtils";

delete L.Icon.Default.prototype._get;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusLabels = {
    PUBLISHED: "Ενεργή",
    CANCELLED: "Ακυρωμένη",
    COMPLETED: "Ολοκληρωμένη",
};

const MyEventPreviewPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);
    const [bookingsDialogOpen, setBookingsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventPreview(id);
                setEvent(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδήλωσης:', err);
                setError('Δεν ήταν δυνατή η φόρτωση της εκδήλωσης.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
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

    return (
        <>
            <Typography sx={{ color: "black", fontSize: "65px", fontWeight: "600" }}>
                {event.title}
            </Typography>

            <Box sx={{ display: "flex", gap: "10px", overflowX: "auto", width: "100%" }}>
                {event.images.map((img) => (
                    <Box
                        key={img.id}
                        sx={{
                            width: "300px",
                            height: "200px",
                            backgroundImage: `url(${img.photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "10px",
                            flexShrink: 0,
                        }}
                    />
                ))}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignSelf: "stretch",
                    justifyContent: "center",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                }}
            >
                <Typography sx={{ alignSelf: "stretch", color: "black", textAlign: "center", fontSize: "28px" }}>
                    Περιγραφή
                </Typography>
            </Box>
            <Typography sx={{ color: "black", fontSize: "20px", textAlign: "center", padding: "0 40px" }}>
                {event.description}
            </Typography>

            {event.latitude && event.longitude ? (
                <Box sx={{ width: "905px", height: "400px", borderRadius: "15px", overflow: "hidden" }}>
                    <MapContainer center={[event.latitude, event.longitude]} zoom={15} style={{ width: "100%", height: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[event.latitude, event.longitude]}>
                            <Popup>{event.venue}</Popup>
                        </Marker>
                    </MapContainer>
                </Box>
            ) : (
                <Typography sx={{ color: "#777", fontSize: "18px", textAlign: "center" }}>
                    Η τοποθεσία δεν είναι διαθέσιμη για αυτή την εκδήλωση.
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    width: "905px",
                    padding: "20px 30px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "30px",
                    alignSelf: "center",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", flex: "1 0 0" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", alignSelf: "stretch", flexDirection: "column" }}>
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
                        <Typography sx={{ color: "#201984", textAlign: "start", paddingLeft: "5px", fontSize: "28px", fontWeight: "500", alignSelf: "stretch" }}>
                            {formatEventDateRange(event.startDateTime, event.endDateTime)}
                        </Typography>
                        <Box sx={{ display: "flex", padding: "20px 10px", justifyContent: "flex-start", alignSelf: "flex-start", width: "100%" }}>
                            <Typography sx={{ color: "#000", fontSize: "28px", fontWeight: "500", textAlign: "left" }}>
                                Τοποθεσία: {event.city} <br />
                                Venue: {event.venue} <br />
                                Κατάσταση: {statusLabels[event.status] || event.status}
                            </Typography>
                        </Box>
                    </Box>

                    <MyButton onClick={() => setBookingsDialogOpen(true)}>
                        Πληροφορίες κρατήσεων
                    </MyButton>

                    <Dialog
                        open={bookingsDialogOpen}
                        onClose={() => setBookingsDialogOpen(false)}
                        slotProps={{
                            paper: {
                                sx: {
                                    display: "flex",
                                    width: "764px",
                                    gap: "10px",
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                },
                            },
                        }}
                    >
                        <DialogTitle
                            sx={{
                                display: "flex",
                                height: "80px",
                                padding: "10px",
                                textAlign: "center",
                                fontSize: "28px",
                                fontWeight: "600",
                                color: "black",
                                background: "#fff",
                                justifyContent: "center",
                            }}
                        >
                            Πληροφορίες κρατήσεων
                        </DialogTitle>

                        <DialogContent
                            sx={{
                                display: "flex",
                                padding: "10px 20px",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "10px",
                                alignSelf: "stretch",
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                                {event.ticket_types.map((tt) => (
                                    <Box
                                        key={tt.id}
                                        sx={{
                                            display: "flex",
                                            padding: "10px 15px",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            alignSelf: "stretch",
                                            borderRadius: "5px",
                                            border: "1px solid #FFF",
                                            background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "20px", color: "black" }}>
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
                            </Box>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                display: "flex",
                                height: "80px",
                                padding: "0 20px",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "0 0 15px 15px",
                                background: "#fff",
                            }}
                        >
                            <Typography sx={{ fontSize: "20px", color: "black" }}>
                                Συνολικές Κρατήσεις: {event.reserved}&nbsp;&nbsp;&nbsp;
                                Απομένουν: {event.capacity - event.reserved}
                            </Typography>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    );
};

export default MyEventPreviewPage;