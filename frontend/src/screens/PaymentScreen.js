import React, { useEffect, useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import Logo from "../components/Logo";
import { useStyles } from "../styles";
import { setPaymentType } from "../actions";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodScreen() {
  const styles = useStyles();
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

      // 🔍 Properly extract order ID (more flexible)
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

      // ✅ Redirect to receipt page
      navigate("/receipt");
    } catch (error) {
      console.error("❌ Error during payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Logo large />
        <Typography variant="h3" gutterBottom>
          Payment Method
        </Typography>
        <Typography variant="h5" gutterBottom>
          Cashless Payment
        </Typography>

        <Box
          className={styles.center}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "20px",
          }}
        >
          {/* ✅ FIXED QR CODE PATH */}
          <img
            src="/qrcode.png" // ✅ Use absolute path from public folder
            alt="QR Code for Payment"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "contain",
            }}
            onError={(e) => {
              console.error("❌ QR code image failed to load");
              e.target.style.display = 'none'; // Hide broken image
            }}
          />
        </Box>

        <Typography variant="h6" sx={{ marginTop: "20px", color: "#fff" }}>
          Scan the QR code to pay
        </Typography>

        <Box className={`${styles.center} ${styles.space}`} sx={{ marginTop: "40px" }}>
          <Button
            onClick={confirmHandler}
            variant="contained"
            color="primary"
            className={styles.largeButton}
          >
            Confirm Payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
}