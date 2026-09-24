import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumbs = ({ items, sx }) => {
    const crumbs = [{ label: "Αρχική", to: "/" }, ...items];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                alignSelf: "flex-start",
                padding: "6px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.75)",
                ...sx,
            }}
        >
            {crumbs.map((crumb, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {index > 0 && <NavigateNextIcon sx={{ fontSize: "18px", color: "#555" }} />}
                    {crumb.to ? (
                        <Typography
                            component={Link}
                            to={crumb.to}
                            sx={{
                                fontSize: "22px",
                                color: "#555",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline", color: "black" },
                            }}
                        >
                            {crumb.label}
                        </Typography>
                    ) : (
                        <Typography sx={{ fontSize: "22px", color: "#333", fontWeight: "600" }}>
                            {crumb.label}
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default Breadcrumbs;