import { Button } from "@mui/material";

const MyButton = ({ children, ...props }) => {
    return (
        <Button
            variant="contained"
            sx={{
              display: "flex",
            //   width: "148px",
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
            }}           
            { ...props } 
        >
            { children }
        </Button>
    );
};

export default MyButton;