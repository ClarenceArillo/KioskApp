import React, { useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
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

      const text = await response.text(); // ✅ read body either way (helps debugging)

      if (!response.ok) {
        console.error("❌ Payment failed:", text);
        alert("Payment failed. Please try again.");
        return;
      }

      console.log("✅ Payment response:", text);

      // ✅ Try multiple patterns (backend might format it differently)
      const match =
        text.match(/order\s*id[:\s]*([0-9]+)/i) ||
        text.match(/\bID[:\s]*([0-9]+)\b/i) ||
        text.match(/orderId["\s:=]*([0-9]+)/i);

      if (!match || !match[1]) {
        alert("No order ID found. Please complete a payment first.");
        return;
      }

      const orderId = match[1].trim();
      localStorage.setItem("orderId", orderId);
      console.log("💾 Saved orderId:", orderId);

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: "url(/images/payment-bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Button
        onClick={confirmHandler}
        disableRipple={false}
        sx={{
          p: 0,
          minWidth: "unset",
          borderRadius: 3,
          top: 190,
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          "&:hover img": { transform: "scale(1.02)" },
          "&:active img": { transform: "scale(0.99)" },
          "&:focus-visible": {
            outline: "3px solid rgba(255,255,255,0.7)",
            outlineOffset: "6px",
          },
        }}
      >
        <Box
          component="img"
          src="/images/confirm-btn.png"
          alt="Confirm Payment"
          sx={{
            height: 90,
            width: "auto",
            display: "block",
            objectFit: "contain",
            transition: "transform 0.25s ease",
            pointerEvents: "none",
            userSelect: "none",
            pb: 2,
          }}
        />
      </Button>
    </Box>
  );
}
