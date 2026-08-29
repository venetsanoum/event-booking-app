import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom"
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
        <Box
            sx ={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "stretch",
            }}
        >
            <Box
                sx={{
                    height: "25px",
                    alignSelf: "stretch",
                    background: "linear-gradient(180deg, rgba(23, 247, 255, 0.65) 10.58%, rgba(23, 128, 204, 0.65) 100%)",
                }}
            >
            </Box>
            <Box
                sx={{
                    display: "flex",
                    padding: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "157px",
                    alignSelf: "stretch",
                    background: "#FFF",
                    width: "100%"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        minWidth: "350",
                        minHeight: "20",
                        justifyContent: "center",
                        gap: 10,
                        p:5
                    }}
                >
                    <Box
                        sx={{
                            display:"flex",
                            flexDirection: "column",
                            gap: 1,
                    
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "22px",
                                fontWeight: "700",
                                color: "black",
                                paddingRight: "10px",
                            }}
                        >
                            Περισσότερα
                        </Typography>
                        <Button
                            component = { Link }
                            to="/faq"
                            sx={{
                                textTransform:"none",
                                color:"#000",
                                alignSelf:"start",
                                fontSize: "18px",
                            }}
                        >
                            Συχνές Ερωτήσεις
                        </Button>
                        <Button
                            component = { Link }
                            to="/personal-data"
                            sx={{
                                textTransform:"none",
                                color:"#000",
                                alignSelf:"start",
                                fontSize: "16px",
                            }}
                        >
                            Προσωπικά Δεδομένα
                        </Button>
                        <Button
                            component = { Link }
                            to="/terms-of-use"
                            sx={{
                                textTransform:"none",
                                color:"#000",
                                alignSelf:"start",
                                fontSize: "16px",
                            }}
                        >
                            Όροι Χρήσης
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display:"flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "22px",
                                fontWeight: "700",
                                color: "black",
                            }}
                        >
                            Επικοινωνία
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "18px",
                                color: "black",
                            }}
                        >
                            <a href="mailto:bookingApp@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
                                bookingApp@gmail.com
                            </a>
                        </Typography>
                        <Typography
                            sx={{
                                fontSize:"18px",
                                color: "black",
                            }}
                        >
                            <a href="tel:+302109658418" style={{ color: "inherit", textDecoration: "none" }}>
                                2109658418
                            </a>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
  );
};
export default Footer;