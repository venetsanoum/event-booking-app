import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/adminApi";
import Breadcrumbs from "../components/Breadcrumbs";

const PAGE_SIZE = 20;

const roleLabels = {
    ADMIN: "Διαχειριστής",
    ORGANIZER: "Διοργανωτής",
    ATTENDEE: "Χρήστης",
};

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getAllUsers({
                    limit: PAGE_SIZE,
                    offset: (page - 1) * PAGE_SIZE,
                });
                setUsers(response.data.results || response.data);
                setCount(response.data.count || 0);
            } catch (err) {
                console.log('Αποτυχία φόρτωσης χρηστών:', err);
                setError('Δεν ήταν δυνατή η φόρτωση των χρηστών.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page]);

    const handleExport = async (format) => {
        try {
            const response = format === 'xml' ? await exportXML() : await exportJSON();
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `events.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log('Αποτυχία εξαγωγής:', err);
        }
    };

    return (
        <>
            <Breadcrumbs 
                items={[
                    { label: "Λίστα χρηστών" }
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
                Λίστα χρηστών
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
                        <Typography sx={{ color: "#d32f2f", fontSize: "24px", textAlign: "center" }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && users.map((u) => (
                        <Box
                            key={u.id}
                            component={Link}
                            to={`/admin/users/${u.id}`}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 15px",
                                borderRadius: "5px",
                                textDecoration: "none",
                                color: "black",
                                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                                "&:hover": { background: "#fff" },
                            }}
                        >
                            <Typography sx={{ width: "200px", fontSize: "18px", textAlign: "left" }}>
                                {u.username}
                            </Typography>
                            <Typography sx={{ flex: 1, fontSize: "18px", textAlign: "center" }}>
                                {u.email}
                            </Typography>
                            <Typography sx={{ width: "150px", fontSize: "18px", textAlign: "right" }}>
                                {roleLabels[u.role] || u.role}
                            </Typography>
                        </Box>

                    ))}
                    {count > PAGE_SIZE && (
                        <Pagination
                            count={Math.ceil(count / PAGE_SIZE)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    fontSize: "18px",
                                    color: "black",
                                    background: "rgba(255, 255, 255, 0.75)",
                                },
                            }}
                        />
                    )}
                </Box>

                <Box sx={{ height: "40px", background: "#fff" }} />
            </Box>
        </>
    );
};

export default AdminUsersPage;