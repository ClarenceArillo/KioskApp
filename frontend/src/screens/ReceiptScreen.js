import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
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

        const { data } = await axios.get(
          `http://localhost:7000/order/receipt/${orderId}`
        );

        setReceipt({
          restaurantName: data.restaurantName || "Aya sa Hapag - Makati",
          restaurantAddress:
            data.restaurantAddress ||
            "Makati Avenue, Poblacion, Makati City",
          contactNumber: data.contactNumber || "(+63) 927-531-4820",
          email: data.email || "ayasahapagmkt@gmail.com",
          orderId: data.orderId || 0,
          orderType: data.orderType || "N/A",
          orderDateTime: data.orderDateTime || new Date().toISOString(),
          totalPrice: data.totalPrice || 0,
          receiptItems: Array.isArray(data.receiptItems)
            ? data.receiptItems
            : [],
        });

        setLoading(false);
      } catch (err) {
        let message = "Failed to fetch receipt";
        if (err.response && err.response.data) {
          const data = err.response.data;
          if (typeof data === "string") message = data;
          else if (data.message) message = data.message;
          else message = JSON.stringify(data);
        } else if (err.message) {
          message = err.message;
        }
        setError(message);
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  const handleDone = () => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      navigate("/");
      return;
    }
    navigate(`/completeorder/${orderId}`);
  };

  if (loading) {
    return (
      <Box
        className={`${styles.root}`}
        sx={{
          backgroundColor: "#ff2040",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className={`${styles.root}`}
        sx={{
          backgroundColor: "#ff2040",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo large />
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#fff",
            color: "#ff2040",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className={`${styles.root}`}
      sx={{
        backgroundColor: "#ff2040", // consistent red tone
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Logo large />

      <Typography
        variant="h3"
        gutterBottom
        sx={{
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          mb: 3,
        }}
      >
        Receipt
      </Typography>

      {/* ✅ Subtle scrollbar */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "24px",
          width: "80%",
          maxWidth: "420px",
          maxHeight: "420px",
          overflowY: "auto",
          boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
          color: "#000000dd",

          // 🌿 Very subtle scrollbar styling
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.08)", // softer and more transparent
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.15)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#ff2040", fontWeight: 700 }}
        >
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

        <Divider sx={{ my: 1.2 }} />

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

        <Divider sx={{ my: 1.2 }} />

        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "#ff2040" }}
        >
          Items
        </Typography>

        {receipt.receiptItems.length > 0 ? (
          receipt.receiptItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 1.5,
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px dashed rgba(0,0,0,0.1)",
                pb: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#333", fontWeight: 500 }}
                >
                  {item.quantity}x {item.itemName} ({item.itemSize})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#ff2040" }}
                >
                  ₱{item.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "right", mt: 0.3 }}
              >
                ₱{item.itemPrice?.toFixed(2) || "0.00"} each
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No items found in this receipt.
          </Typography>
        )}

        <Divider sx={{ my: 1.2 }} />

        <Typography
          variant="h6"
          align="right"
          sx={{ fontWeight: "bold", color: "#000" }}
        >
          Total: ₱{receipt.totalPrice.toFixed(2)}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: "#fff",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Pick up your order at the counter
      </Typography>

      <Button
        variant="contained"
        className={styles.largeButton}
        sx={{
          marginTop: "30px",
          backgroundColor: "#fff",
          color: "#ff2040",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
        onClick={handleDone}
      >
        Done
      </Button>
    </Box>
  );
}
