import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MyButton from "./MyButton";
import { formatEventDateRange } from "../utils/dateUtils";

// Απλή κάρτα που δείχνει τις πληροφορίες ενός event
// Χρησιμοποιείται στα καρουζέλ της αρχικής, τόσο για τα προτεινόμενα
// όσο και για τις εκδηλώσεις του διοργανωτή, γι' αυτό το κουμπί και ο
// προορισμός του δίνονται από έξω.
const EventCard = ({ event, to, buttonLabel, showSeats }) => {

    // Τα δύο endpoints επιστρέφουν τη φωτογραφία με διαφορετικό τρόπο:
    // άλλο ως main_photo και άλλο μέσα στη λίστα images. Δοκιμάζουμε και τα δύο.
    const photo = event.main_photo || (event.images && event.images.length > 0 ? event.images[0].photo : null);

    return (
        <Box
            sx={{
                display: "flex",
                width: "760px",
                height: "300px",
                padding: "20px 30px",
                alignItems: "center",
                gap: "30px",
                borderRadius: "15px",
                border: "5px solid #FFF",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
            }}
        >
            <Box
                sx={{
                    width: "179px",
                    height: "253px",
                    flexShrink: 0,
                    backgroundImage: photo ? `url(${photo})` : "none",
                    backgroundColor: "#ddd",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    justifyContent: "center",
                    flex: 1,
                    gap: "10px",
                }}
            >
                <Typography
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                        color: "black",
                        fontSize: "28px",
                        fontWeight: "500",
                    }}
                >
                    {event.title}
                </Typography>
                <Typography
                    sx={{
                        color: "#201984",
                        fontSize: "24px",
                        fontWeight: "500",
                        textAlign: "left",
                        paddingLeft: "5px",
                    }}
                >
                    {formatEventDateRange(event.startDateTime, event.endDateTime)}
                </Typography>
                <Typography
                    sx={{
                        color: "black",
                        fontSize: "22px",
                        fontWeight: "500",
                        textAlign: "left",
                        paddingLeft: "5px",
                    }}
                >
                    Τοποθεσία: {event.venue}, {event.city} <br />
                    {/* Ο διοργανωτής βλέπει πόσες θέσεις έχουν κρατηθεί,
                        ενώ ο επισκέπτης τη χαμηλότερη τιμή εισιτηρίου */}
                    {showSeats ? `Έχουν κρατηθεί ${event.reserved} θέσεις` : `Τιμή: Από ${event.min_price ?? "-"}€`}
                </Typography>
                <MyButton 
                    component={Link} 
                    to={to} 
                    sx={{ alignSelf: "center"}}
                >
                    {buttonLabel}
                </MyButton>
            </Box>
        </Box>
    );
};

export default EventCard;