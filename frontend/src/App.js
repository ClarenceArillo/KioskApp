import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import HomeScreen from "./screens/HomeScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChooseScreen from "./screens/ChooseScreen";
import OrderScreen from "./screens/OrderScreen";
import ReviewScreen from "./screens/ReviewScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ReceiptScreen from "./screens/ReceiptScreen";
import OrderCompleteScreen from "./screens/OrderCompleteScreen";

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
            <Route path="/" element={<HomeScreen />} />
            <Route path="/choose" element={<ChooseScreen />} />
            <Route path="/order" element={<OrderScreen />} />
            <Route path="/review" element={<ReviewScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/receipt" element={<ReceiptScreen />} /> 
            <Route path="/completeorder/:orderId" element={<OrderCompleteScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
