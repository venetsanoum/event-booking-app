import { Box, Typography } from "@mui/material";
import MyButton from "./MyButton.jsx";

const SearchCard = ({ event_photo, title, date_start, date_end, address, lowest_price }) => {
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
                    backgroundImage: `url(${event_photo})`,
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
                        gap: "30px",
                        alignSelf: "stretch",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        sx={{
                            display: "flex",
                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 46.15%, rgba(255, 255, 255, 0.21) 100%)",
                            color: "black",
                            textAlign: "center",
                            fontSize: "28px",
                            fontWeight: "500",
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
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#000",
                                fontSize: "28px",
                                fontWeight: "500",
                            }}
                        >
                            Τοποθεσία: {address} <br />
                            Τιμή: Από {lowest_price}
                        </Typography>
                    </Box>
                </Box>
                <MyButton>
                    Μάθε Περισσότερα
                </MyButton>
            </Box>
            {/* <Box
                sx={{
                    width: "17px",
                    height: "361px",
                    position: "absolute",
                    right: "0",
                    borderRadius: "15px 0 0 15px",
                    background: "#EA0000"
                }}
            >

            </Box> */}
        </Box>
    );
};

export default SearchCard;