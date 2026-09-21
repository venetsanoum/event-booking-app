import { Button } from "@mui/material";

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
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default MyButton;