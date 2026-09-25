import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import MyButton from "../components/MyButton";
import { sendMessage } from "../api/messagingApi";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";

const SendMessagePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [subject, setSubject] = useState(location.state?.subject || '');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!location.state || !location.state.eventId || !location.state.receiverId) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "60px" }}>
                <Typography sx={{ color: "#d32f2f", fontSize: "18px", textAlign: "center" }}>
                    Δεν υπάρχουν στοιχεία παραλήπτη για αυτό το μήνυμα.
                </Typography>
                <MyButton component={Link} to="/my-messages">
                    Επιστροφή στα μηνύματα
                </MyButton>
            </Box>
        );
    }

    const { eventId, receiverId, receiverName } = location.state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!subject.trim() || !content.trim()) {
            setError('Συμπλήρωσε θέμα και περιεχόμενο.');
            return;
        }

        setSubmitting(true);
        try {
            await sendMessage(eventId, {
                receiver: receiverId,
                event: eventId,
                subject: subject,
                content: content,
            });
            setSuccess(true);
            setTimeout(() => navigate('/my-messages'), 1500);
        } catch (err) {
            console.log('Αποτυχία αποστολής:', err);
            setError('Κάτι πήγε στραβά. Δοκίμασε ξανά.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
        <Breadcrumbs
            items={[
                { label: "Μηνύματα", to: "/my-messages" },
                { label: "Σύνθεση μηνύματος" },
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
                Σύνθεση μηνύματος
            </Typography>

            <Box
                component="form"
                id="send-message-form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "750px",
                    padding: "20px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "24px" }}>
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography sx={{ color: "green", fontSize: "20px" }}>
                        Το μήνυμα στάλθηκε επιτυχώς!
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        height: "50px",
                        padding: "0 10px",
                        alignItems: "center",
                        gap: "10px",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                    }}
                >
                    <Typography
                        sx={{
                            width: "70px",
                            flexShrink: 0,
                            fontSize: "22px",
                            fontStyle: "italic",
                            color: "black",
                            textAlign: "left",
                        }}
                    >
                        Από:
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "22px",
                            color: "black",
                            textAlign: "left",
                        }}
                    >
                        {user?.username}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        height: "50px",
                        padding: "0 10px",
                        alignItems: "center",
                        gap: "10px",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                    }}
                >
                    <Typography
                        sx={{
                            width: "70px",
                            flexShrink: 0,
                            fontSize: "22px",
                            fontStyle: "italic",
                            color: "black",
                            textAlign: "left",
                        }}
                    >
                        Προς:
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "22px",
                            color: "black",
                            textAlign: "left",
                        }}
                    >
                        {receiverName}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        height: "50px",
                        padding: "0 10px",
                        alignItems: "center",
                        gap: "10px",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                    }}
                >
                    <Typography
                        sx={{
                            width: "70px",
                            flexShrink: 0,
                            fontSize: "22px",
                            fontStyle: "italic",
                            color: "black",
                            textAlign: "left",
                        }}
                    >
                        Θέμα:
                    </Typography>
                    <TextField
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        size="small"
                        sx={{
                            flex: 1,
                            background: "#fff",
                        }}
                    />
                </Box>

                <TextField
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    rows={9}
                    fullWidth
                    sx={{
                        marginTop: "20px",
                        background: "#fff",
                        borderRadius: "8px",
                    }}
                />
            </Box>

            <MyButton
                type="submit"
                form="send-message-form"
                disabled={submitting}
            >
                {submitting ? "Αποστολή..." : "Αποστολή"}
            </MyButton>
        </>
    );
};

export default SendMessagePage;