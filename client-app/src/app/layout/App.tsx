import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { grey, blueGrey } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "../context/StoreContext";
import agent from "../api/agent";
import { getCookie } from "../util/util";
import LoadingComponent from "./LoadingComponent";

function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]);

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
