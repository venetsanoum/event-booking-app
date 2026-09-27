import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Typography, TextField, CircularProgress, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MyButton from "../components/MyButton";
import { createDraftEvent, editEvent, getEventForEdit, createTicketType, uploadEventImage, getCategories, publishEvent, editTicketType } from "../api/eventsApi";
import { Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";
import Breadcrumbs from "../components/Breadcrumbs";

const EditEventPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [eventStatus, setEventStatus] = useState(null);
    const [initLoading, setInitLoading] = useState(isEditMode);
    const [initError, setInitError] = useState('');
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: [],
        eventType: '',
        venue: '',
        address: '',
        city: '',
        country: '',
        startDateTime: '',
        endDateTime: '',
        capacity: '',
    });

    const [ticketTypes, setTicketTypes] = useState([
        { name: '', price: '', quantity: '' },
    ]);

    const [photoFiles, setPhotoFiles] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data.results || response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης κατηγοριών:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isEditMode) {
            setInitLoading(false);
            return;
        }

        const fetchEvent = async () => {
            try {
                const response = await getEventForEdit(id);
                const event = response.data;
                setFormData({
                    title: event.title || '',
                    description: event.description || '',
                    category: event.category
                        ? event.category.map((c) => (typeof c === 'object' ? c.id : c))
                        : [],
                    eventType: event.eventType || '',
                    venue: event.venue || '',
                    address: event.address || '',
                    city: event.city || '',
                    country: event.country || '',
                    startDateTime: event.startDateTime ? event.startDateTime.slice(0, 16) : '',
                    endDateTime: event.endDateTime ? event.endDateTime.slice(0, 16) : '',
                    capacity: event.capacity || '',
                });
                setEventStatus(event.status);
                if (event.ticket_types && event.ticket_types.length > 0) {
                    if (event.ticket_types && event.ticket_types.length > 0) {
                        setTicketTypes(event.ticket_types.map((tt) => ({
                            id: tt.id,
                            name: tt.name,
                            price: tt.price,
                            quantity: tt.quantity,
                            sold: tt.quantity - tt.available,
                        })));
                    }
                }
            } catch (err) {
                console.log('Αποτυχία φόρτωσης εκδήλωσης:', err);
                setInitError('Δεν ήταν δυνατή η φόρτωση της εκδήλωσης.');
            } finally {
                setInitLoading(false);
            }
        };
        fetchEvent();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCategoryChange = (e) => {
        setFormData({
            ...formData,
            category: e.target.value,
        });
    };

    const handleTicketTypeChange = (index, field, value) => {
        const updated = [...ticketTypes];
        updated[index] = { ...updated[index], [field]: value };
        setTicketTypes(updated);
    };

    const handleAddTicketType = () => {
        setTicketTypes([...ticketTypes, { name: '', price: '', quantity: '' }]);
    };

    const handleRemoveTicketType = (index) => {
        setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotoFiles([...photoFiles, ...files]);
    };

    const handleRemovePhoto = (index) => {
        setPhotoFiles(photoFiles.filter((_, i) => i !== index));
    };

    const getMissingFields = () => {
        const missing = [];

        if (!formData.title.trim()) missing.push("Τίτλος");
        if (!formData.description.trim()) missing.push("Περιγραφή");
        if (formData.category.length === 0) missing.push("Κατηγορία");
        if (!formData.venue.trim()) missing.push("Venue");
        if (!formData.address.trim()) missing.push("Διεύθυνση");
        if (!formData.city.trim()) missing.push("Πόλη");
        if (!formData.country.trim()) missing.push("Χώρα");
        if (!formData.startDateTime) missing.push("Ημερομηνία έναρξης");
        if (!formData.endDateTime) missing.push("Ημερομηνία λήξης");
        if (!formData.capacity) missing.push("Χωρητικότητα");

        const validTickets = ticketTypes.filter(
            (tt) => tt.name.trim() && tt.price && tt.quantity
        );
        if (validTickets.length === 0) {
            missing.push("τουλάχιστον έναν τύπο εισιτηρίου");
        }

        return missing;
    };

    const handleSubmit = async (e, shouldPublish = false) => {
        e.preventDefault();
        setError('');

        if (shouldPublish) {
            const missing = getMissingFields();
            if (missing.length > 0) {
                setError(`Για δημοσίευση πρέπει να συμπληρώσεις: ${missing.join(", ")}.`);
                return;
            }
        }
        const invalidTicket = ticketTypes.find(
            (tt) => tt.sold && Number(tt.quantity) < tt.sold
        );
        if (invalidTicket) {
            setError(`Η ποσότητα για "${invalidTicket.name}" δεν μπορεί να είναι μικρότερη από ${invalidTicket.sold}.`);
            return;
        }
        setSubmitting(true);

        try {
            let eventId = id;
            const cleanedData = {};
            Object.keys(formData).forEach((key) => {
                let value = formData[key];

                if (Array.isArray(value)) {
                    value = value.filter((v) => v !== null && v !== undefined);
                    if (value.length === 0) return;
                }

                if (value !== '' && value !== null && value !== undefined) {
                    cleanedData[key] = value;
                }
            });
            if (isEditMode) {
                await editEvent(id, cleanedData);
            } else {
                const response = await createDraftEvent(cleanedData);
                eventId = response.data.event_id;
            }

            for (let i = 0; i < ticketTypes.length; i++) {
                const tt = ticketTypes[i];

                if (tt.id) {
                    await editTicketType(eventId, tt.id, {
                        name: tt.name,
                        price: tt.price,
                        quantity: tt.quantity
                    });
                } else if (
                    tt.name &&
                    tt.price !== '' &&
                    tt.quantity !== ''
                ) {
                    const response = await createTicketType(eventId, {
                        name: tt.name,
                        price: tt.price,
                        quantity: tt.quantity
                    });

                    const newTicketType = response.data;

                    setTicketTypes(prev =>
                        prev.map((ticket, index) =>
                            index === i
                                ? { ...ticket, id: newTicketType.id }
                                : ticket
                        )
                    );
                }
            }
            for (const file of photoFiles) {
                const imgFormData = new FormData();
                imgFormData.append('photo', file);
                await uploadEventImage(eventId, imgFormData);
            }

            if (shouldPublish) {
                if (eventStatus !== "PUBLISHED") {
                    await publishEvent(eventId);
                }
                navigate(`/my-events/${eventId}`);
            } else {
                navigate('/my-events');
            }
        } catch (err) {
            console.log('Αποτυχία αποθήκευσης:', err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                const message = data.error || data.detail || Object.values(data)[0];
                setError(Array.isArray(message) ? message[0] : message);
            } else {
                setError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (initLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (initError) {
        return (
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
                {initError}
            </Typography>
        );
    }

return (
    <>
        <Breadcrumbs 
            items={[
                { label: "Οι εκδηλώσεις μου", to: "/my-events" },
                { label: isEditMode ? (formData.title || "Επεξεργασία") : "Νέα εκδήλωση" },
            ]}
            sx={{
                marginLeft: "-30px",
                marginTop: "-110px",
            }}
        />   
        <Typography sx={{ color: "black", fontSize: "65px", fontWeight: "600" }}>
            Επεξεργασία εκδήλωσης
        </Typography>

        <Box
            component="form"
            id="edit-event-form"
            sx={{
                display: "flex",
                width: "905px",
                padding: "30px",
                flexDirection: "column",
                alignItems: "stretch",
                gap: "16px",
                borderRadius: "15px",
                border: "5px solid #FFF",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
            }}
        >
            {error && (
                <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center" }}>
                    {error}
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    height: "56px",
                    padding: "0 20px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Τίτλος
                </Typography>
                <TextField 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px 20px",
                    gap: "10px",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Περιγραφή
                </Typography>
                <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={5}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    padding: "16px 20px",
                    alignItems: "center",
                    gap: "20px",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Φωτογραφίες
                </Typography>
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "10px", 
                        flex: 1 
                    }}
                >
                    <Box 
                        sx={{ 
                            display: "flex", 
                            gap: "10px", 
                            flexWrap: "wrap" 
                        }}
                    >
                        {photoFiles.map((file, index) => (
                            <Box 
                                key={index}
                                sx={{ 
                                    position: "relative" 
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundImage: `url(${URL.createObjectURL(file)})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "8px",
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemovePhoto(index)}
                                    sx={{ position: "absolute", top: -8, right: -8, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <MyButton 
                        component="label" 
                        sx={{ 
                            alignSelf: "flex-start" 
                        }}
                    >
                        Επίλεξε εικόνα
                        <input type="file" accept="image/*" multiple hidden onChange={handlePhotoChange} />
                    </MyButton>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    height: "56px",
                    padding: "0 20px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Κατηγορία
                </Typography>
                <Select
                    multiple
                    displayEmpty
                    value={formData.category}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput size="small" />}
                    renderValue={(selected) =>
                        selected.length === 0 ? "Επίλεξε κατηγορίες" : `${selected.length} επιλεγμένες`
                    }
                    fullWidth
                    size="small"
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            <Checkbox checked={formData.category.indexOf(cat.id) > -1} />
                            <ListItemText primary={cat.name} />
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Τύπος Εκδήλωσης
                </Typography>
                <TextField 
                    name="eventType" 
                    value={formData.eventType} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Venue
                </Typography>
                <TextField 
                    name="venue" 
                    value={formData.venue} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Διεύθυνση
                </Typography>
                <TextField 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Πόλη
                </Typography>
                <TextField 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center",  
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Χώρα
                </Typography>
                <TextField 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small"
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Έναρξη
                </Typography>
                <TextField
                    name="startDateTime"
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    size="small"
                />
            </Box>
            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" 
                }}
            >
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Λήξη
                </Typography>
                <TextField
                    name="endDateTime"
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    size="small"
                />
            </Box>

            <Box 
                sx={{ 
                    display: "flex", 
                    height: "56px", 
                    padding: "0 20px", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)" }}>
                <Typography 
                    sx={{ 
                        width: "160px", 
                        flexShrink: 0,
                        fontSize: "22px", 
                        color: "black",
                        textAlign: "left",
                    }}
                >
                    Χωρητικότητα
                </Typography>
                <TextField 
                    name="capacity" 
                    type="number" 
                    value={formData.capacity} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small" 
                />
            </Box>

            <Box 
                sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "10px 5px 0 5px" 
                }}
            >
                <Typography 
                    sx={{ 
                        fontSize: "24px", 
                        fontWeight: "600", 
                        color: "black" 
                    }}
                >
                    Τύποι εισιτηρίου
                </Typography>
                <IconButton onClick={handleAddTicketType} sx={{ background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>
                    <AddIcon />
                </IconButton>
            </Box>

            {ticketTypes.map((tt, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        padding: "16px 20px",
                        borderRadius: "10px",
                        border: "2px solid #FFF",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                    }}
                >
                    <Box 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "20px" 
                        }}
                    >
                        <Typography 
                            sx={{ 
                                width: "160px", 
                                flexShrink: 0,
                                fontSize: "22px", 
                                color: "black",
                                textAlign: "left",
                            }}
                        >
                            Τίτλος
                        </Typography>
                        <TextField 
                            value={tt.name} 
                            onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)} 
                            fullWidth 
                            size="small" 
                        />
                    </Box>
                    <Box 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "20px" 
                        }}
                    >
                        <Typography 
                            sx={{ 
                                width: "160px", 
                                flexShrink: 0,
                                fontSize: "22px", 
                                color: "black",
                                textAlign: "left",
                            }}
                        >
                            Τιμή
                        </Typography>
                        <TextField 
                            type="number" 
                            value={tt.price} 
                            onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)} 
                            fullWidth 
                            size="small"
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <Typography sx={{ width: "160px", flexShrink: 0, fontSize: "22px", color: "black", textAlign: "left" }}>
                            Ποσότητα
                        </Typography>
                        <TextField
                            type="number"
                            value={tt.quantity}
                            onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                            fullWidth
                            size="small"
                            slotProps={{ htmlInput: { min: tt.sold || 0 } }}
                            helperText={tt.sold > 0 ? `Έχουν ήδη πωληθεί ${tt.sold} εισιτήρια` : ''}
                        />
                        {ticketTypes.length > 1 && (
                            <IconButton onClick={() => handleRemoveTicketType(index)} size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
        <Box 
            sx={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "24px",
                padding: "24px 0" 
            }}
        >
            <Link 
                to="/my-events" 
                style={{ 
                    color: "black", 
                    textDecoration: "underline", 
                    fontSize: "22px", 
                    display: "flex", 
                    alignItems: "center"
                }}
            >
                Ακύρωση
            </Link>
            {eventStatus !== "PUBLISHED" && (
                <MyButton
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={submitting}
                >
                    {submitting ? "Αποθήκευση..." : "Προσωρινή αποθήκευση"}
                </MyButton>
            )}
            <MyButton
                onClick={(e) => handleSubmit(e, true)}
                disabled={submitting}
            >
                {submitting ? "Επεξεργασία..." : "Δημοσίευση"}
            </MyButton>
        </Box>
    </>
);

};

export default EditEventPage;