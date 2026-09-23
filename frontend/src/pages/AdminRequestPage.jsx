import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { getPendingUsers, setUserApproval } from "../api/adminApi";

const roleLabels = {
    ORGANIZER: "Διοργανωτής",
    ATTENDEE: "Χρήστης",
};

const AdminRequestsPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await getPendingUsers();
                setUsers(response.data.results || response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης αιτημάτων:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των αιτημάτων.');
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleDecision = async (id, status) => {
        try {
            await setUserApproval(id, status);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            console.log('Αποτυχία ενημέρωσης:', err);
            setError('Δεν ήταν δυνατή η ενημέρωση του αιτήματος.');
        }
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
                Αιτήματα
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "700px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    background: "#fff",
                }}
            >
                <Box sx={{ height: "40px", background: "#fff" }} />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "15px",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center" }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <Typography sx={{ color: "#777", fontSize: "18px", textAlign: "center" }}>
                            Δεν υπάρχουν αιτήματα σε αναμονή.
                        </Typography>
                    )}

                    {!loading && users.map((u) => (
                        <Box
                            key={u.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: "5px 5px 5px 15px",
                                borderRadius: "5px",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                            }}
                        >
                            <Box
                                component={Link}
                                to={`/admin/users/${u.id}`}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flex: 1,
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                <Typography sx={{ width: "180px", fontSize: "18px", textAlign: "left" }}>
                                    {u.username}
                                </Typography>
                                <Typography sx={{ flex: 1, fontSize: "18px", textAlign: "left" }}>
                                    {u.email}
                                </Typography>
                                <Typography sx={{ width: "130px", fontSize: "18px", textAlign: "left" }}>
                                    {roleLabels[u.role] || u.role}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: "4px" }}>
                                <IconButton
                                    onClick={() => handleDecision(u.id, "APPROVED")}
                                    sx={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "2px solid black",
                                        background: "#fff",
                                        color: "green",
                                    }}
                                >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDecision(u.id, "REJECTED")}
                                    sx={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "2px solid black",
                                        background: "#fff",
                                        color: "#d32f2f",
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ height: "40px", background: "#fff" }} />
            </Box>
        </>
    );
};

export default AdminRequestsPage;