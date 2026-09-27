import { Box } from "@mui/material";

// Ένα component που περιέχει όλα τα περιέχομενα της σελίδας
// Χρησιμοποιείται κυρίως για styling
const MainBox = ({ children, sx }) => {
    return (
        <Box
            sx={{
                display: "flex",
                width: "1093px",
                padding: "50px 30px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "70px",
                borderRadius: "30px",
                border: "3px solid rgba(255, 255, 255, 0.40)",
                background: "rgba(255, 255, 255, 0.30)",
                backdropFilter: "blur(22.5px)",
                ...sx
            }}
        >
            { children }
        </Box>
    );
};

export default MainBox;