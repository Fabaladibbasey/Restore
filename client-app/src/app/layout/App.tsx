import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { grey, blueGrey } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const loadApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadApp();
  }, [loadApp]);

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

  if (loading) return <LoadingComponent message="Initialising app..." />;

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
