import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Tabs, Tab, Checkbox, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import MyButton from "../components/MyButton";
import { getInbox, getSent, deleteFromInbox, deleteFromSent } from "../api/messagingApi";

const tabConfig = [
    { label: "Εισερχόμενα", fetchFn: getInbox, deleteFn: deleteFromInbox, personLabel: "Αποστολέας" },
    { label: "Απεσταλμένα", fetchFn: getSent, deleteFn: deleteFromSent, personLabel: "Παραλήπτης" },
];

const MyMessagesPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState([]);

    const loadMessages = async () => {
        setLoading(true);
        setError('');
        setSelected([]);
        try {
            const response = await tabConfig[activeTab].fetchFn();
            setMessages(response.data.results || response.data);
        } catch (err) {
            console.log('Αποτυχία φόρτωσης μηνυμάτων:', err);
            setError('Δεν ήταν δυνατή η φόρτωση μηνυμάτων.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [activeTab]);

    const toggleSelect = (id) => {
        setSelected(
            selected.includes(id)
                ? selected.filter((sid) => sid !== id)
                : [...selected, id]
        );
    };

    const handleDeleteSelected = async () => {
        try {
            for (const id of selected) {
                await tabConfig[activeTab].deleteFn(id);
            }
            setMessages(messages.filter((m) => !selected.includes(m.id)));
            setSelected([]);
        } catch (err) {
            console.log('Αποτυχία διαγραφής:', err);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "40px" }}>
            <Typography sx={{ color: "black", fontSize: "50px", fontWeight: "600" }}>
                Μηνύματα
            </Typography>

            <Box sx={{ display: "flex", width: "700px" }}>
                <MyButton component={Link} to="/my-messages/new">
                    Νέο μήνυμα
                </MyButton>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "700px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        "& .MuiTab-root": { fontSize: "16px", textTransform: "none" },
                    }}
                >
                    {tabConfig.map((tab) => (
                        <Tab key={tab.label} label={tab.label} />
                    ))}
                </Tabs>
                    <IconButton onClick={handleDeleteSelected} disabled={selected.length === 0}>
                        <DeleteIcon />
                    </IconButton>
                </Box>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center", padding: "20px" }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && messages.length === 0 && (
                    <Typography sx={{ textAlign: "center", color: "#777", fontSize: "18px", padding: "20px" }}>
                        Δεν υπάρχουν μηνύματα.
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "10px",
                    }}
                > 
                    {!loading && !error && messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                padding: "8px 20px",
                                background: msg.isRead
                                    ? "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)"
                                    : "linear-gradient(180deg, rgba(200, 220, 255, 0.90) 46.15%, rgba(180, 210, 255, 0.90) 100%)",
                            }}
                        >
                            <Checkbox
                                checked={selected.includes(msg.id)}
                                onChange={() => toggleSelect(msg.id)}
                            />
                            <Link to={`/my-messages/${msg.id}`} style={{ textDecoration: "none", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontSize: "18px", fontWeight: msg.isRead ? "400" : "700", color: "black", width: "150px" }}>
                                    {activeTab === 0 ? msg.sender?.username : msg.receiver?.username}
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: "black", flex: 1 }}>
                                    {msg.event?.title} - {msg.subject}
                                </Typography>
                                <Typography sx={{ fontSize: "16px", color: "#555" }}>
                                    {new Date(msg.sendDateTime).toLocaleDateString('el-GR')}
                                </Typography>
                            </Link>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default MyMessagesPage;