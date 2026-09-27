import { Box, Typography } from "@mui/material";
import MyButton from "./MyButton.jsx";
import { Link } from "react-router-dom";

// Κάρτα εκδήλωσης για τη σελίδα αναζήτησης. Δέχεται τα στοιχεία έτοιμα
// από τη σελίδα, ώστε να μην ασχολείται με τη μορφοποίηση ημερομηνιών.
const SearchCard = ({ event_id, event_photo, title, date_start, date_end, address, min_price }) => {
    return (
        <Box
            sx={{
                display: "flex",
                height: "361px",
                padding: "20px 30px",
                justifyContent: "center",
                alignItems: "center",
                gap: "30px",
                alignSelf: "stretch",
                borderRadius: "15px",
                border: "5px solid #FFF",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
            }}
        >     
            <Box
                sx={{
                    backgroundImage: event_photo ? `url(${event_photo})` : "none",
                    backgroundColor: "#ddd",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "179px",
                    height: "253px",
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "30px",
                    flex: "1 0 0",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        sx={{
                            display: "flex",
                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                            color: "black",
                            justifyContent: "center",
                            fontSize: "28px",
                            fontWeight: "500",
                            alignSelf: "stretch"
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            color: "#201984",
                            textAlign: "center",
                            fontSize: "28px",
                            fontWeight: "500",
                        }}
                    >
                        {date_start} - {date_end}
                    </Typography>
                <Box
                    sx={{
                        display: "flex",
                        padding: "20px 10px",
                        justifyContent: "flex-start",
                        alignSelf: "flex-start",
                        width: "100%",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#000",
                            fontSize: "28px",
                            fontWeight: "500",
                            textAlign: "left",
                        }}
                    >
                        Τοποθεσία: {address} <br />
                        Τιμή: Από {min_price}€
                    </Typography>
                </Box>
                </Box>
                <MyButton
                    component={Link}
                    to={`/events/${event_id}`}
                >
                    Μάθε Περισσότερα
                </MyButton>
            </Box>
        </Box>
    );
};

export default SearchCard;