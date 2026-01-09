import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Footer from "./layout/Footer";
import Navbar from "./layout/NavBar/NavBar";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <Navbar />
      <Box sx={{ width: "100%", maxWidth: "1200px", flex: 1, padding: 2 }}>
        <Outlet />
      </Box>
      <Footer />
     
    
    </Box>
  );
}

export default App;
