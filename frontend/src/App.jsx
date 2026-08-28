import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: "url('/backgroundimage.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}/>
        </Routes>
      </Box>
    </>
  )
}

export default App;