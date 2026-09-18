import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import AccountEditPage from "./pages/AccountEditPage";
import SearchPage from "./pages/SearchPage";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import BookingAcceptedPage from "./pages/BookingAcceptedPage";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import MainBox from "./components/MainBox";
import Footer from "./components/Footer";

function App() {
  return (
    <Box
      sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: "url('/backgroundimage.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          gap: "110px",
      }}
    >
      <NavBar />
      <MainBox>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}/>
          <Route path="/login" element={<LoginPage></LoginPage>}/>
          <Route path="/signup" element={<SignupPage></SignupPage>}/>
          <Route path="/account" element={<AccountPage></AccountPage>}/>
          <Route path="/account-edit" element={<AccountEditPage></AccountEditPage>}/>
          <Route path="/search" element={<SearchPage></SearchPage>}/>
          <Route path="/events/:id" element={<EventPage></EventPage>}/>
          <Route path="/booking" element={<BookingPage></BookingPage>}/>
          <Route path="/booking-accepted" element={<BookingAcceptedPage></BookingAcceptedPage>}/>
        </Routes>
      </MainBox>
      <Footer/>
    </Box>
  )
}

export default App;