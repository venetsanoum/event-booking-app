import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MyButton from "../components/MyButton";
import { getUserInfo, setUserApproval } from "../api/adminApi";
import Breadcrumbs from "../components/Breadcrumbs";
import { useLocation } from "react-router-dom";

const AdminUserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserInfo(id);
                setUser(response.data);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης χρήστη:', err);
                setError('Δεν ήταν δυνατή η φόρτωση του χρήστη.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleDecision = async (status) => {
        setSubmitting(true);
        try {
            await setUserApproval(id, status);
            navigate('/admin/requests');
        } catch (err) {
            console.log('Αποτυχία ενημέρωσης:', err);
            setError('Δεν ήταν δυνατή η ενημέρωση του αιτήματος.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !user) {
        return (
            <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center", padding: "60px" }}>
                {error}
            </Typography>
        );
    }

    const fields = [
        { label: "Όνομα", value: user.first_name },
        { label: "Επώνυμο", value: user.last_name },
        { label: "E-mail", value: user.email },
        { label: "Τηλέφωνο", value: user.phone },
        { label: "ΑΦΜ", value: user.afm },
        { label: "Username", value: user.username },
    ];

    return (
        <>
            <Breadcrumbs 
                items={[
                    location.state?.isPending
                        ? { label: "Αιτήματα", to: "/admin/requests" }
                        : { label: "Λίστα χρηστών", to: "/admin/users" },
                    { label: `${user.first_name} ${user.last_name}` },
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
                {user.first_name} {user.last_name}
            </Typography>

            {user.profile_photo ? (
                <Avatar src={user.profile_photo} sx={{ width: 170, height: 170 }} />
            ) : (
                <Avatar sx={{ width: 170, height: 170, bgcolor: "#ccc" }}>
                    <AccountCircleIcon sx={{ fontSize: 170 }} />
                </Avatar>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "500px",
                    padding: "15px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                {fields.map((field) => (
                    <Box
                        key={field.label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "5px 10px",
                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                        }}
                    >
                        <Typography sx={{ width: "120px", flexShrink: 0, fontSize: "18px", color: "black", textAlign: "left" }}>
                            {field.label}
                        </Typography>
                        <Typography sx={{ fontSize: "18px", color: "black", textAlign: "left" }}>
                            {field.value || "-"}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {error && (
                <Typography sx={{ color: "#d32f2f", fontSize: "18px" }}>
                    {error}
                </Typography>
            )}

            {user.approval_status === "PENDING" && (
                <Box sx={{ display: "flex", gap: "10px" }}>
                    <MyButton onClick={() => handleDecision("REJECTED")} disabled={submitting}>
                        Απόρριψη
                    </MyButton>
                    <MyButton onClick={() => handleDecision("APPROVED")} disabled={submitting}>
                        Αποδοχή
                    </MyButton>
                </Box>
            )}
        </>
    );
};

export default AdminUserDetailsPage;