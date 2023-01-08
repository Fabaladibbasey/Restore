import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { grey, blueGrey } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? blueGrey[900] : grey[50],
        paper: darkMode ? blueGrey[800] : grey[100],
      },
    },
  });
  const onHandleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header onHandleDarkMode={onHandleDarkMode} darkMode={darkMode} />
      <Container
        sx={{
          marginY: "2rem",
        }}
      >
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
