import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Avatar } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import MyButton from "../components/MyButton";
import { getMessageDetails } from "../api/messagingApi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Breadcrumbs from "../components/Breadcrumbs";
import { MarginOutlined } from "@mui/icons-material";

const ViewMessagePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await getMessageDetails(id);
                setMessage(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης μηνύματος:', err);
                setError('Δεν ήταν δυνατή η φόρτωση του μηνύματος.');
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
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

    const handleReply = () => {
        navigate('/my-messages/new', {
            state: {
                receiverId: message.sender.id,
                receiverName: message.sender.username,
                eventId: message.event.id,
                eventTitle: message.event.title,
                subject: `Re: ${message.subject}`,
            },
        });
    };

    return (
        <>
            <Breadcrumbs
                items={[
                    { label: "Μηνύματα", to: "/my-messages" },
                    { label: message.subject },
                ]}
                sx={{
                    marginLeft: "-30px",
                    marginTop: "-200px",
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "905px",
                    padding: "20px",
                    borderRadius: "15px",
                    // border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:"left",
                        alignItems: "center",
                        alignSelf: "stretch",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                    }}
                >
                    <Typography 
                        sx={{ 
                            fontSize: "36px", 
                            fontWeight: "500", 
                            color: "black" 
                        }}
                    >
                        {message.subject}
                    </Typography>
                </Box>
                <Box 
                    sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        alignSelf: "stretch",
                    }}
                >
                    <Box 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "23px" 
                        }}
                    >
                        {message.sender.profile_photo ? (
                            <Avatar 
                                src={message.sender.profile_photo}
                                sx={{
                                    width: "60px",
                                    height: "60px",
                                }} 
                            />
                        ) : (
                            <Avatar 
                                sx={{ 
                                    bgcolor: "#ccc",
                                    width: "60px",
                                    height: "60px",
                                }}
                            >
                                <AccountCircleIcon sx={{ width: "60px", height: "60px" }}/>
                            </Avatar>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "3px",
                            }}
                        >
                            <Typography 
                                sx={{ 
                                    fontSize: "20px", 
                                    fontStyle: "italic", 
                                    color: "black"
                                }}
                            >
                                {message.sender.username}
                            </Typography>
                            <Typography sx={{ fontSize: "16px", color: "#777" }}>
                                προς {message.receiver.username}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Typography sx={{ fontSize: "14px", fontStyle: "italic", color: "#555" }}>
                            {new Date(message.sendDateTime).toLocaleString('el-GR')}
                        </Typography>
                        <MyButton onClick={handleReply}>
                            Απάντηση
                        </MyButton>
                    </Box>
                </Box>

                <Typography sx={{ fontSize: "18px", color: "black", whiteSpace: "pre-wrap" }}>
                    {message.content}
                </Typography>
            </Box>
        </>
    );
};

export default ViewMessagePage;