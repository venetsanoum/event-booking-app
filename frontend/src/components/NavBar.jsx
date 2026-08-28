import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/AuthContext.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InboxIcon from "@mui/icons-material/Inbox";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState(null);

  return (
    <div className="nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100
      }}      
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(180deg, #FFF 34.62%, rgba(255, 255, 255, 0.40) 100%)',
          display: 'flex',
          height: '85px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '386px',
          alignSelf: 'stretch'
        }}
      >
        <Toolbar 
          sx={{ 
            maxWidth: 1440, 
            width: "100%", 
            mx: "auto", 
            position:"relative",
          }}
        >
          {/* my pet logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: "Luckiest Guy",
              fontSize: "28px",
              fontWeight: "normal",
              color: "black",
            }}
          >
            Booking App
          </Typography>

          {/* vet - owner - lost pets */}
          <Box 
            sx={{ 
              position:"absolute", 
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex", 
              gap: 3, 
              alignItems: "center" 
            }}
          >
            <Button
              component={Link}
              to="/search"
              sx={{ 
                color: "#555", 
                textTransform: "none",
                fontSize: "20px",
              }}
            >
              Αναζήτηση
            </Button>
        </Box>
        
        {/* signin signup */}
        <Box 
          sx={{ 
            display: "flex",
            alignItems: "center", 
            gap:1,
          }}
        >
          {!user && (
            <>
              <Button
                variant="contained"
                component={Link}
                to="/signup"
                sx={{
                  fontSize: "20px",
                  backgroundColor: "#00A7E1",
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#006283" },
                }}
              >
                Εγγραφή
              </Button>
              <Button
                variant="contained"
                component={Link}
                to={`/login-page?redirect=/`}
                sx={{
                  fontSize: "20px",
                  backgroundColor: "#64B6AC",
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#0aa896" },
                }}
              >
                Σύνδεση
              </Button>
            </>
          )}
          {user && user.role === "attendee" && (
            <>
              <Box>
                <IconButton onClick={(e)=> setProfileAnchor(e.currentTarget)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {user.profileData?.photo ? (
                      <Box
                        component="img"
                        src={user.profileData.photo}
                        alt="profile"
                        sx={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <AccountCircleIcon 
                        sx={{
                          fontSize: "50px"
                        }}
                      />
                    )}
                      <KeyboardArrowDownIcon
                        sx={{
                          transition: "0.2s",
                        }}
                      />
                  </Box>
                </IconButton>
                <InboxIcon
                    sx={{
                        fontSize: "50px"
                    }}
                >
                </InboxIcon>
                <Menu
                  anchorEl={profileAnchor}
                  open = {Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                >
                    <MenuItem
                        component={Link}
                        to="/account"
                        sx={{
                        fontSize: "18px",
                        }}
                    >
                        Λογαριασμός
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/bookings"
                        sx={{
                        fontSize: "18px",
                        }}
                    > 
                        Κρατήσεις
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/messages"
                        sx={{
                        fontSize: "18px",
                        }}
                    > 
                        Μηνύματα
                    </MenuItem>
                    <MenuItem
                    component={Link}
                    to={"/"}
                    onClick={() =>{
                        logout();
                        setProfileAnchor(null);
                    }}
                    sx={{
                        fontSize: "18px",
                        textTransform: "none"
                    }}
                    >
                    Αποσύνδεση
                    </MenuItem>
                </Menu>
              </Box>
            </>
          )}
          {user && user.role === "organizer" && (
            <>
              <Box>
                <IconButton onClick={(e)=> setProfileAnchor(e.currentTarget)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {user.profileData?.photo ? (
                      <Box
                        component="img"
                        src={user.profileData.photo}
                        alt="profile"
                        sx={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <AccountCircleIcon 
                        sx={{
                          fontSize: "50px"
                        }}
                      />
                    )}
                      <KeyboardArrowDownIcon
                        sx={{
                          transition: "0.2s",
                        }}
                      />
                  </Box>
                </IconButton>
                <InboxIcon
                    sx={{
                        fontSize: "50px"
                    }}
                >
                </InboxIcon>
                <Menu
                  anchorEl={profileAnchor}
                  open = {Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                >
                    <MenuItem
                        component={Link}
                        to="/account"
                        sx={{
                        fontSize: "18px",
                        }}
                    >
                        Λογαριασμός
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/events"
                        sx={{
                        fontSize: "18px",
                        }}
                    > 
                        Εκδηλώσεις
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/bookings"
                        sx={{
                        fontSize: "18px",
                        }}
                    > 
                        Κρατήσεις
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/messages"
                        sx={{
                        fontSize: "18px",
                        }}
                    > 
                        Μηνύματα
                    </MenuItem>
                    <MenuItem
                    component={Link}
                    to={"/"}
                    onClick={() =>{
                        logout();
                        setProfileAnchor(null);
                    }}
                    sx={{
                        fontSize: "18px",
                        textTransform: "none"
                    }}
                    >
                    Αποσύνδεση
                    </MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    </div>
  );
};

export default NavBar;
