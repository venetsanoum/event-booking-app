import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MyButton from "../components/MyButton";
import { exportXML, exportJSON } from "../api/adminApi";

const AdminHomePage = () => {
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    const handleExport = async (format) => {
        setExporting(true);
        setError('');
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
            setError('Δεν ήταν δυνατή η εξαγωγή των δεδομένων.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <Typography
                sx={{
                    color: "black",
                    fontFamily: "Luckiest Guy",
                    fontSize: "80px",
                    fontWeight: "400",
                    padding: "30px 20px 20px 20px",
                }}
            >
                Booking App
            </Typography>

            <Typography
                sx={{
                    width: "905px",
                    color: "black",
                    fontSize: "26px",
                    textAlign: "center",
                    padding: "0 20px 30px 20px",
                }}
            >
                Καλώς ήρθες στη διαχείριση της εφαρμογής. Από εδώ μπορείς να διαχειριστείς τους χρήστες, να εγκρίνεις νέες εγγραφές και να εξάγεις τα δεδομένα των εκδηλώσεων.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "443px",
                        height: "300px",
                        padding: "20px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "30px",
                        borderRadius: "15px",
                        border: "5px solid #FFF",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Typography sx={{ alignSelf: "stretch", color: "black", textAlign: "center", fontSize: "30px", fontWeight: "500" }}>
                        Χρήστες
                    </Typography>
                    <Typography sx={{ alignSelf: "stretch", color: "black", textAlign: "center", fontSize: "24px", fontWeight: "500" }}>
                        Δες όλους τους εγγεγραμμένους χρήστες της εφαρμογής και τα στοιχεία τους.
                    </Typography>
                    <MyButton component={Link} to="/admin/users">
                        Λίστα χρηστών
                    </MyButton>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        width: "443px",
                        height: "300px",
                        padding: "20px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "30px",
                        borderRadius: "15px",
                        border: "5px solid #FFF",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                    }}
                >
                    <Typography sx={{ alignSelf: "stretch", color: "black", textAlign: "center", fontSize: "30px", fontWeight: "500" }}>
                        Αιτήματα
                    </Typography>
                    <Typography sx={{ alignSelf: "stretch", color: "black", textAlign: "center", fontSize: "24px", fontWeight: "500" }}>
                        Έγκρινε ή απόρριψε τις νέες εγγραφές που βρίσκονται σε αναμονή.
                    </Typography>
                    <MyButton component={Link} to="/admin/requests">
                        Αιτήματα εγγραφής
                    </MyButton>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "905px",
                    padding: "30px 20px",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                <Typography sx={{ color: "black", fontSize: "30px", fontWeight: "500" }}>
                    Εξαγωγή δεδομένων
                </Typography>
                <Typography sx={{ color: "black", fontSize: "22px", textAlign: "center" }}>
                    Κατέβασε τα στοιχεία όλων των εκδηλώσεων, μαζί με τους τύπους εισιτηρίων και τις κρατήσεις τους.
                </Typography>

                {error && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "20px", textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: "flex", gap: "20px" }}>
                    <MyButton onClick={() => handleExport('xml')} disabled={exporting}>
                        {exporting ? "Εξαγωγή..." : "Εξαγωγή σε XML"}
                    </MyButton>
                    <MyButton onClick={() => handleExport('json')} disabled={exporting}>
                        {exporting ? "Εξαγωγή..." : "Εξαγωγή σε JSON"}
                    </MyButton>
                </Box>
            </Box>
        </>
    );
};

export default AdminHomePage;