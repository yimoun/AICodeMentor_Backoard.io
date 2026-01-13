import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Footer from "../ui/Footer";
import Navbar from "../ui/NavBar/NavBar";

function HomeLayout() {
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

export default HomeLayout;
