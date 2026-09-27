import { Button } from "@mui/material";

// Styling ενός βασικού κουμπιού για να επαναχρησιμοποιείται εύκολα
const MyButton = ({ children, sx, ...props }) => {
    return (
        <Button
            variant="contained"
            sx={{
                display: "flex",
                height: "46px",
                padding: "15px 25px",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                borderRadius: "8px",
                background: "black",
                textTransform: "none",
                fontSize: "20px",
                fontWeight: "600",
                "&:hover": { backgroundColor: "#45464D" },
                // Το sx το τραβάμε ξεχωριστά από τα υπόλοιπα props και το
                // βάζουμε τελευταίο, ώστε να συγχωνεύεται με το βασικό στυλ.
                // Αν ερχόταν μέσα από το {...props}, θα το αντικαθιστούσε ολόκληρο.
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default MyButton;