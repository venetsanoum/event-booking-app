import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Typography, Button } from "@mui/material";
import MyButton from "./MyButton.jsx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/AuthContext.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InboxIcon from "@mui/icons-material/Inbox";
import { Link } from "react-router-dom";
import { alignItems, borderRadius, justifyContent } from "@mui/system";

const NavBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "85px",
        padding: "0 100px",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(180deg, #FFF 34.62%, rgba(255, 255, 255, 0.40) 100%)"
      }}
    >
      <Typography // logo
        component={Link}
        to="/"
        sx={{
          display: "flex",
          padding: "10px 15px",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
          fontFamily: "Inter",
          fontSize: "28px",
          fontStyle: "normal",
          fontWeight: "700",
          lineHeight: "normal",
          textDecoration: "none",
        }}
      >
        Booking App
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Button 
          component={Link}
          to="/"
          sx={{ 
            color: "#555", 
            textTransform: "none",
            fontSize: "22px",
            "&:hover": { color: "black" },
          }}
        >
          Αναζήτηση
        </Button>
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <MyButton
            // component={Link}
            // to={`/login?redirect=/`}
          >
            Σύνδεση
          </MyButton>
          <MyButton
            // component={Link}
            // to={`/login?redirect=/`}
          >
            Εγγραφή
          </MyButton>
        </Box>
      </Box>

    </Box>
  );
};

export default NavBar;
