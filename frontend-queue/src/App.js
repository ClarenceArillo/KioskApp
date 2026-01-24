import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QueueScreen from "./screens/QueueScreen";

const theme = createTheme({
  typography: {
    h1: { fontWeight: "bold" },
    h2: {
      fontSize: "2rem",
      color: "black",
    },
    h3: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "white",
    },
  },
  palette: {
    primary: { main: "#ff1744" },
    secondary: {
      main: "#118e16",
      contrastText: "#ffffff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/queue" element={<QueueScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
