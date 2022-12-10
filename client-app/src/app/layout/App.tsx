import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { grey, blueGrey } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";

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
      <CssBaseline />
      <Header onHandleDarkMode={onHandleDarkMode} darkMode={darkMode} />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
