import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";import { useParams } from 'react-router-dom';
import { getEventDetails } from "../api/eventsApi";
import MyButton from "../components/MyButton";
const EventPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventDetails(id);
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

    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (ticketTypeId, value) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value) || 0);
        setQuantities({
            ...quantities,
            [ticketTypeId]: numValue,
        });
    };
    

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

    const totalSelected = Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0);

    const totalPrice = event.ticket_types.reduce((sum, tt) => {
        const qty = quantities[tt.id] || 0;
        return sum + qty * parseFloat(tt.price);
    }, 0);

    const handleBookingSubmit = () => {
        console.log('Επιλεγμένα εισιτήρια:', quantities);
        setTicketDialogOpen(false);
        // TODO: εδώ θα καλέσουμε το create booking API, στο επόμενο session
    };

    return (
    <>
    <Typography
        sx={{
            color: "black",
            fontSize: "65px",
            fontWeight: "600",
        }}
    >
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
        <Typography
            sx={{
                alignSelf: "stretch",
                color: "black",
                textAlign: "center",
                fontSize: "28px",
                justifyContent:"center",
            }}
        >
            Περιγραφή
        </Typography>
    </Box>
    <Typography 
        sx={{ 
            color: "black", 
            fontSize: "20px", 
            textAlign: "center", 
            padding: "0 40px" 
        }}
    >
        {event.description}
    </Typography>
    <Box
        sx={{
            display: "flex",
            height: "361px",
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
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
                        alignSelf: "stretch"
                    }}
                >
                    {event.title}
                </Typography>
                <Typography
                    sx={{
                        color: "#201984",
                        textAlign: "center",
                        fontSize: "28px",
                        fontWeight: "500",
                    }}
                >
                    {new Date(event.startDateTime).toLocaleDateString('el-GR')} - {new Date(event.endDateTime).toLocaleDateString('el-GR')}
                </Typography>
            <Box
                sx={{
                    display: "flex",
                    padding: "20px 10px",
                    justifyContent: "flex-start",   // ← άλλαξε από "center"
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
                    Τοποθεσία: {event.city} <br />
                    Venue: {event.venue}
                </Typography>
            </Box>
            </Box>
            <MyButton
                onClick={() => setTicketDialogOpen(true)}
            >
                Εισητήρια
            </MyButton>
            <Dialog
                open={ticketDialogOpen}
                onClose={() => setTicketDialogOpen(false)}
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
                    Επιλογή εισητηρίων
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
                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: "16px", width: "100%",
                        }}
                    >
                        {event.ticket_types.map((tt) => (
                            <Box
                                key={tt.id}
                                sx={{
                                    display: "flex",
                                    padding: "5px 10px",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    alignSelf: "stretch",
                                    borderRadius: "5px",
                                    border: "1px solid #FFF",
                                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                                    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                                }}
                            >
                                <Typography sx={{ fontSize: "22px", color: "black" }}>
                                    {tt.name} <br />
                                    {tt.price}€
                                </Typography>
                                <TextField
                                    type="number"
                                    value={quantities[tt.id] ?? ''}
                                    onChange={(e) => handleQuantityChange(tt.id, e.target.value)}
                                    slotProps={{ htmlInput: { min: 0, max: tt.available } }}
                                    sx={{
                                        width: "90px",
                                        background: "#fff",
                                        borderRadius: "5px",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        display: "flex",
                        height: "80px",
                        padding: "0 20px",
                        alignItems: "center",
                        gap: "130px",
                        alignSelf: "stretch",
                        borderRadius: "0 0 15px 15px",
                        background: "#Fff",
                    }}
                >
                    <Typography sx={{ fontSize: "20px", color: "black" }}>
                        Επιλεγμένα: {totalSelected}&nbsp;&nbsp;&nbsp;Σύνολο: {totalPrice.toFixed(2)}€
                    </Typography>
                    <MyButton onClick={handleBookingSubmit} disabled={totalSelected === 0}>
                        Συνέχεια
                    </MyButton>
                </DialogActions>
            </Dialog>
        </Box>
    </Box>
    </>
    );
};

export default EventPage;