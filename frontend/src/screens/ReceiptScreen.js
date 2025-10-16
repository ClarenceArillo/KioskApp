import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useStyles } from "../styles";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReceiptScreen() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const orderId = localStorage.getItem("orderId");
        if (!orderId) {
          setError("No order ID found. Please complete a payment first.");
          setLoading(false);
          return;
        }

        console.log("📦 Fetching receipt for orderId:", orderId);
        const { data } = await axios.get(
          `http://localhost:7000/order/receipt/${orderId}`
        );

        // ✅ Ensure we always have a consistent structure
        setReceipt({
          restaurantName: data.restaurantName || "KioskApp Restaurant",
          restaurantAddress: data.restaurantAddress || "123 Sample Street, Manila",
          contactNumber: data.contactNumber || "0912 345 6789",
          email: data.email || "support@kioskapp.com",
          orderId: data.orderId || 0,
          orderType: data.orderType || "N/A",
          orderDateTime: data.orderDateTime || new Date().toISOString(),
          totalPrice: data.totalPrice || 0,
          receiptItems: Array.isArray(data.receiptItems) ? data.receiptItems : [],
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching receipt:", err);
        setError(err.response?.data || "Failed to fetch receipt");
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  const handleDone = () => {
    localStorage.removeItem("orderId");
    navigate("/completeorder");
  };

  if (loading) {
    return (
      <Box className={`${styles.root} ${styles.navy}`}>
        <Box className={`${styles.main} ${styles.center}`}>
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={`${styles.root} ${styles.navy}`}>
        <Box className={`${styles.main} ${styles.center}`}>
          <Logo large />
          <Alert severity="error">{error}</Alert>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  // ✅ Render receipt safely
  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Logo large />

        <Typography variant="h3" gutterBottom>
          Receipt Printing
        </Typography>

        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "24px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "400px",
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            {receipt.restaurantName}
          </Typography>
          <Typography align="center" variant="body2">
            {receipt.restaurantAddress}
          </Typography>
          <Typography align="center" variant="body2">
            {receipt.contactNumber}
          </Typography>
          <Typography align="center" variant="body2" gutterBottom>
            {receipt.email}
          </Typography>

          <hr />

          <Typography variant="body1">
            <strong>Order ID:</strong> {receipt.orderId}
          </Typography>
          <Typography variant="body1">
            <strong>Order Type:</strong> {receipt.orderType}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Date:</strong>{" "}
            {new Date(receipt.orderDateTime).toLocaleString()}
          </Typography>

          <hr />

          <Typography variant="h6" gutterBottom>
            Items:
          </Typography>

          {receipt.receiptItems.length > 0 ? (
            receipt.receiptItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Typography variant="body2">
                  {item.quantity}x {item.itemName} ({item.itemSize})
                </Typography>
                <Typography variant="body2">
                  ₱{item.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No items found in this receipt.
            </Typography>
          )}

          <hr />

          <Typography variant="h6" align="right">
            Total: ₱{receipt.totalPrice.toFixed(2)}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{ marginTop: "20px", color: "#fff" }}
        >
          Pick up your order at the counter
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className={styles.largeButton}
          sx={{ marginTop: "30px" }}
          onClick={handleDone}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
}
