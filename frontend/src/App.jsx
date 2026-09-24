import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import AccountEditPage from "./pages/AccountEditPage";
import SearchPage from "./pages/SearchPage";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import BookingAcceptedPage from "./pages/BookingAcceptedPage";
import MyEventsPage from "./pages/MyEventsPage";
import EditEventPage from "./pages/EditEventPage";
import EventPreviewPage from "./pages/EventPreviewPage";
import MyMessagesPage from "./pages/MyMessagesPage";
import ViewMessagePage from "./pages/ViewMessagePage";
import SendMessagePage from "./pages/SendMessagePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminRequestsPage from "./pages/AdminRequestPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";
import EventBookingsPage from "./pages/EventBookingsPage";
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
          <Route path="/my-events" element={<MyEventsPage></MyEventsPage>}/>
          <Route path="/my-events/new" element={<EditEventPage></EditEventPage>}/>
          <Route path="/my-events/:id/edit" element={<EditEventPage></EditEventPage>}/>
          <Route path="/my-events/:id" element={<EventPreviewPage></EventPreviewPage>} />
          <Route path="/my-messages" element={<MyMessagesPage></MyMessagesPage>}/>
          <Route path="/my-messages/:id" element={<ViewMessagePage></ViewMessagePage>}/>
          <Route path="/my-messages/new" element={<SendMessagePage></SendMessagePage>}/>
          <Route path="/my-bookings" element={<MyBookingsPage></MyBookingsPage>}/>
          <Route path="/admin/users" element={<AdminUsersPage></AdminUsersPage>}/>
          <Route path="/admin/requests" element={<AdminRequestsPage></AdminRequestsPage>}/>
          <Route path="/admin/users/:id" element={<AdminUserDetailsPage></AdminUserDetailsPage>}/>
          <Route path="/my-events/:id/bookings" element={<EventBookingsPage></EventBookingsPage>}/>
        </Routes>
      </MainBox>
      <Footer/>
    </Box>
  )
}

export default App;