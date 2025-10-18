import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KitchenTabsScreen from "./screens/KitchenTabsScreen"; 
import { StoreProvider } from "./Store"; 

const theme = createTheme({
  typography: {
    h1: { fontWeight: "bold" },
    h2: { fontSize: "2rem", color: "black" },
    h3: { fontSize: "1.8rem", fontWeight: "bold", color: "white" },
  },
  palette: {
    primary: { main: "#ff1744" },
    secondary: { main: "#118e16", contrastText: "#ffffff" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StoreProvider>
        <BrowserRouter>
          <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
            <Routes>
              <Route path="/kitchen" element={<KitchenTabsScreen />} />
            </Routes>
          </div>
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
