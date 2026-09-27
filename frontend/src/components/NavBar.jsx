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
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { getUnreadCount } from "../api/messagingApi";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavBar = () => {

  const { user, logout } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState(false);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
      if (!user) {
          setUnreadCount(0);
          return;
      }
      const fetchUnread = async () => {
          try {
              const response = await getUnreadCount();
              setUnreadCount(response.data.unread);
          } catch (err) {
              console.log('Αποτυχία φόρτωσης unread count:', err);
          }
      };
      fetchUnread();
  }, [user, location.pathname]);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
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
        {(!user || user.role !== "ADMIN") && (
            <Button
                component={Link}
                to="/search"
                sx={{
                    color: "#555",
                    textTransform: "none",
                    fontSize: "22px",
                    "&:hover": { color: "black" },
                }}
            >
                Αναζήτηση
            </Button>
        )}
        {user && user.role === "ATTENDEE" ? (
          <>
          <IconButton component={Link} to="/my-messages">
              <Badge badgeContent={unreadCount} color="error">
                  <InboxIcon sx={{ fontSize: "28px", color: "#555" }} />
              </Badge>
          </IconButton>
          <IconButton onClick={(e)=> setProfileAnchor(e.currentTarget)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {user.profile_photo ? (
                <Box
                  component="img"
                  src={user.profile_photo.startsWith('http')
                      ? user.profile_photo
                      : `https://127.0.0.1:8000${user.profile_photo}`}
                  alt="profile"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <AccountCircleIcon 
                  sx={{
                    fontSize: "44px"
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
          <Menu
            anchorEl={profileAnchor}
            open = {Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            slotProps={{
                paper: {
                    sx: {
                        display: "inline-flex",
                        padding: "10px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "5px",
                        borderRadius: "15px",
                        border: "2px solid #fff",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                        marginLeft: "-40px"
                      },
                },
            }}
          >
            <MenuItem
              component={Link}
              to="/account"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            >
              Το πορφίλ μου
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-bookings"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            > 
              Κρατήσεις
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-messages"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            > 
              Μηνύματα
            </MenuItem>
            <MenuItem
                onClick={() => {
                    logout();
                    setProfileAnchor(null);
                    navigate('/');
                }}
            >
                Αποσύνδεση
            </MenuItem>
          </Menu>
          </>
        ) : user && user.role === "ORGANIZER" ? (
          <>
          <IconButton component={Link} to="/my-messages">
              <Badge badgeContent={unreadCount} color="error">
                  <InboxIcon sx={{ fontSize: "28px", color: "#555" }} />
              </Badge>
          </IconButton>
          <IconButton onClick={(e)=> setProfileAnchor(e.currentTarget)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {user.profile_photo ? (
                <Box
                  component="img"
                  src={user.profile_photo.startsWith('http')
                      ? user.profile_photo
                      : `https://127.0.0.1:8000${user.profile_photo}`}
                  alt="profile"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <AccountCircleIcon 
                  sx={{
                    fontSize: "44px"
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
          <Menu
            anchorEl={profileAnchor}
            open = {Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            slotProps={{
                paper: {
                    sx: {
                        display: "inline-flex",
                        padding: "10px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "5px",
                        borderRadius: "15px",
                        border: "2px solid #fff",
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                        marginLeft: "-40px"
                      },
                },
            }}
          >
            <MenuItem
              component={Link}
              to="/account"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            >
              Το προφίλ μου
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-events"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            >
              Εκδηλώσεις
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-bookings"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            > 
              Κρατήσεις
            </MenuItem>
            <MenuItem
              component={Link}
              to="/my-messages"
              onClick={() => setProfileAnchor(null)}
              sx={{
                fontSize: "18px",
              }}
            > 
              Μηνύματα
            </MenuItem>
            <MenuItem
                onClick={() => {
                    logout();
                    setProfileAnchor(null);
                    navigate('/');
                }}
            >
                Αποσύνδεση
            </MenuItem>
          </Menu>
          </>
          ) : user && user.role === "ADMIN" ? (
              <>
                <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccountCircleIcon sx={{ fontSize: "44px" }} />
                        <KeyboardArrowDownIcon sx={{ transition: "0.2s" }} />
                    </Box>
                </IconButton>
                  <Menu
                      anchorEl={profileAnchor}
                      open={Boolean(profileAnchor)}
                      onClose={() => setProfileAnchor(null)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                 slotProps={{
                          paper: {
                              sx: {
                                  display: "inline-flex",
                                  padding: "10px",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: "5px",
                                       borderRadius: "15px",
                                  border: "2px solid #fff",
                                  background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.80) 22.6%, rgba(233, 255, 255, 0.80) 100%)",
                              },
                          },
                      }}
                  >
                      <MenuItem
                          component={Link}
                          to="/admin/users"
                          onClick={() => setProfileAnchor(null)}
                          sx={{ fontSize: "18px" }}
                      >
                          Λίστα χρηστών
                      </MenuItem>
                      <MenuItem
                          component={Link}
                          to="/admin/requests"
                          onClick={() => setProfileAnchor(null)}
                          sx={{ fontSize: "18px" }}
                      >
                          Αιτήματα
                      </MenuItem>
                      <MenuItem
                          onClick={() => {
                              logout();
                              setProfileAnchor(null);
                              navigate('/');
                          }}
                          sx={{ fontSize: "18px" }}
                      >
                          Αποσύνδεση
                      </MenuItem>
                  </Menu>
              </>
          ) : ( // no login
          <Box
            sx={{
              display: "flex",
              padding: "10px",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <MyButton
              component={Link}
              to={`/login`}
            >
              Σύνδεση
            </MyButton>
            <MyButton
              component={Link}
              to={`/signup`}
            >
              Εγγραφή
            </MyButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NavBar;
