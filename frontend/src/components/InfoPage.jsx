import { Box, Typography } from "@mui/material";
import Breadcrumbs from "./Breadcrumbs";

const InfoPage = ({ title, sections }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
            }}
        >
            <Breadcrumbs
                items={[{ label: title }]}
                sx={{ marginLeft: "-90px", marginTop: "-110px" }}
            />

            <Typography
                sx={{
                    color: "black",
                    fontSize: "65px",
                    fontWeight: "600",
                    textAlign: "center",
                }}
            >
                {title}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    width: "905px",
                    padding: "30px 40px",
                    borderRadius: "15px",
                    border: "5px solid #FFF",
                    background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                }}
            >
                {sections.map((section, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Typography
                            sx={{
                                fontSize: "26px",
                                fontWeight: "600",
                                color: "black",
                                textAlign: "left",
                            }}
                        >
                            {section.heading}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                color: "black",
                                textAlign: "left",
                            }}
                        >
                            {section.text}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default InfoPage;