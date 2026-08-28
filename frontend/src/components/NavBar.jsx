import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Typography, Button } from "@mui/material";
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
        width: "1440px",
        height: "85px",
        padding: "0 30px",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(180deg, #FFF 34.62%, rgba(255, 255, 255, 0.40) 100%)"
      }}
    >
      <Typography // logo
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
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            color: "black",
            fontFamily: "Inter",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal",
          }}
        >
          Αναζήτηση
        </Typography>
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Button
            variant="contained"
            // component={Link}
            // to={`/login?redirect=/`}
            sx={{
              display: "flex",
              width: "148px",
              height: "46px",
              padding: "15px 25px",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              borderRadius: "8px",
              background: "black",
              textTransform: "none",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Σύνδεση
          </Button>
          <Button
            variant="contained"
            // component={Link}
            // to={`/login?redirect=/`}
            sx={{
              display: "flex",
              width: "148px",
              height: "46px",
              padding: "15px 25px",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              borderRadius: "8px",
              background: "black",
              textTransform: "none",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Εγγραφή
          </Button>
        </Box>
      </Box>

    </Box>
  );
};

export default NavBar;
