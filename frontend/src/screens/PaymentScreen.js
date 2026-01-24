import React, { useEffect, useContext } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import Logo from "../components/Logo";
import { setPaymentType } from "../actions";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodScreen() {
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    setPaymentType(dispatch, "Cashless (QR Payment)");
  }, [dispatch]);

  const confirmHandler = async () => {
    try {
      const response = await fetch("http://localhost:7000/order/cart/view/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("❌ Payment failed:", errorMessage);
        alert("Payment failed. Please try again.");
        return;
      }

      const data = await response.text();
      console.log("✅ Payment successful:", data);

      const orderIdMatch =
        data.match(/order id[:\s]*([0-9]+)/i) || data.match(/ID:\s*(\d+)/i);

      if (orderIdMatch && orderIdMatch[1]) {
        const orderId = orderIdMatch[1].trim();
        localStorage.setItem("orderId", orderId);
        console.log("💾 Order ID saved to localStorage:", orderId);
      } else {
        console.error("⚠️ Could not extract order ID from response:", data);
        alert("Unexpected response format. Please try again.");
        return;
      }

      navigate("/receipt");
    } catch (error) {
      console.error("❌ Error during payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(180deg, #ff2040 0%, #c9102e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* === Logo and Header === */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box sx={{ transform: "scale(1.4)", mb: 1 }}>
          <Logo />
        </Box>
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 0.5,
            letterSpacing: "0.5px",
          }}
        >
          Payment Method
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 500,
          }}
        >
          Cashless Payment
        </Typography>
      </Box>

      {/* === QR CODE BOX === */}
      <Paper
        elevation={6}
        sx={{
          width: "360px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: 4,
          padding: 4,
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            padding: 3,
            mb: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/images/qrcode.png"
            alt="QR Code"
            style={{
              width: "230px",
              height: "230px",
              objectFit: "contain",
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: "#222",
            fontWeight: 600,
            mb: 3,
          }}
        >
          Scan the QR Code to Pay
        </Typography>

        <Button
          onClick={confirmHandler}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#ff2040",
            "&:hover": { backgroundColor: "#e01b36" },
            fontWeight: 600,
            borderRadius: 3,
            textTransform: "none",
            padding: "10px 0",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(255,32,64,0.3)",
          }}
        >
          Confirm Payment
        </Button>
      </Paper>

      {/* === Subtext === */}
      <Typography
        variant="body1"
        sx={{
          color: "rgba(255,255,255,0.85)",
          mt: 4,
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
      >
        Please complete your payment to continue
      </Typography>
    </Box>
  );
}
