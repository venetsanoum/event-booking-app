import { useState, useEffect } from "react";
import { Box, IconButton, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import { getEventPreview, cancelEvent } from "../api/eventsApi";
import MyButton from "../components/MyButton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatEventDateRange } from "../utils/dateUtils";
import Breadcrumbs from "../components/Breadcrumbs";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";


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
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');
    const [photoIndex, setPhotoIndex] = useState(0);

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
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
                {error}
            </Typography>
        );
    }

    const handleCancelEvent = async () => {
        setCancelling(true);
        setCancelError('');
        try {
            await cancelEvent(id);
            const response = await getEventPreview(id);
            setEvent(response.data);
            setCancelDialogOpen(false);
        } catch (err) {
            console.log('Αποτυχία ακύρωσης:', err);
            setCancelError('Δεν ήταν δυνατή η ακύρωση της εκδήλωσης.');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <>
            <Breadcrumbs
                items={[
                    { label: "Οι εκδηλώσεις μου", to: "/my-events" },
                    { label: event.title },
                ]}
                sx={{
                    marginLeft: "-30px",
                    marginTop: "-120px",
                }}
            />
            <Typography sx={{ color: "black", fontSize: "65px", fontWeight: "600" }}>
                {event.title}
            </Typography>

            {event.images.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <IconButton
                        onClick={() => setPhotoIndex((prev) => (prev - 1 + event.images.length) % event.images.length)}
                        disabled={event.images.length <= 1}
                    >
                        <NavigateBefore sx={{ fontSize: "40px" }} />
                    </IconButton>

                    <Box
                        sx={{
                            width: "900px",
                            height: "500px",
                            backgroundImage: `url(${event.images[photoIndex].photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "15px",
                            border: "5px solid #FFF",
                        }}
                    />

                    <IconButton
                        onClick={() => setPhotoIndex((prev) => (prev + 1) % event.images.length)}
                        disabled={event.images.length <= 1}
                    >
                        <NavigateNext sx={{ fontSize: "40px" }} />
                    </IconButton>
                </Box>
            )}

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

                    <Box sx={{ display: "flex", gap: "16px" }}>
                        {event.status === "PUBLISHED" && (
                        <MyButton
                            onClick={() => setCancelDialogOpen(true)}
                            sx={{
                                background: "#fff",
                                color: "#d32f2f",
                                border: "2px solid #d32f2f",
                                "&:hover": { backgroundColor: "#d32f2f", color: "#fff" },
                            }}
                        >
                            Ακύρωση εκδήλωσης
                        </MyButton>
                        )}
                        <MyButton onClick={() => setBookingsDialogOpen(true)}>
                            Πληροφορίες κρατήσεων
                        </MyButton>
                    </Box>

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
                    <Dialog
                        open={cancelDialogOpen}
                        onClose={() => setCancelDialogOpen(false)}
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
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "16px",
                                padding: "24px",
                                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                            }}
                        >
                            <Typography
                                sx={{
                                    width: "434px",
                                    fontSize: "22px",
                                    fontWeight: "600",
                                    color: "black",
                                    textAlign: "center",
                                }}
                            >
                                Είσαι σίγουρος/η ότι θέλεις να ακυρώσεις την εκδήλωση; Όλοι όσοι έχουν κάνει κράτηση θα ενημερωθούν με μήνυμα. Η ενέργεια δεν αναιρείται.
                            </Typography>
                            {cancelError && (
                                <Typography sx={{ color: "#d32f2f", fontSize: "16px", textAlign: "center" }}>
                                    {cancelError}
                                </Typography>
                            )}
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Button
                                    onClick={() => setCancelDialogOpen(false)}
                                    sx={{
                                        color: "black",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Πίσω
                                </Button>
                                <MyButton 
                                    onClick={handleCancelEvent} 
                                    disabled={cancelling}
                                    sx={{
                                        background: "#fff",
                                        color: "#d32f2f",
                                        border: "2px solid #d32f2f",
                                        "&:hover": { backgroundColor: "#d32f2f", color: "#fff" },
                                    }}
                                >
                                    {cancelling ? "Ακύρωση..." : "Ακύρωση εκδήλωσης"}
                                </MyButton>
                            </Box>
                        </DialogContent>
                    </Dialog>
                </Box>
            </Box>
        </>
    );
};

export default MyEventPreviewPage;