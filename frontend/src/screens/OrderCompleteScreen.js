import React, { useEffect, useState, useContext } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { useStyles } from "../styles";
import axios from "axios";
import { Store } from "../Store";
import { ORDER_CLEAR } from "../constants";

export default function OrderCompleteScreen() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const styles = useStyles();
  const { dispatch } = useContext(Store);

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch receipt data
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        let id = orderId;
        if (!id) id = localStorage.getItem("orderId");

        if (!id) {
          throw new Error("No order ID available to fetch the receipt.");
        }

        const res = await fetch(`http://localhost:7000/order/receipt/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load receipt");
        }
        const data = await res.json();
        setReceipt(data);

        // Clear stored orderId if matched
        const stored = localStorage.getItem("orderId");
        if (stored && stored === String(id)) {
          localStorage.removeItem("orderId");
        }
      } catch (err) {
        console.error("❌ Failed to fetch receipt:", err);
        setError("Could not load receipt. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [orderId]);

  // Start a new order
  const handleOrderAgain = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      await axios.post("http://localhost:7000/order/start");
      dispatch({ type: ORDER_CLEAR });
      localStorage.removeItem("orderId");
      console.log("🆕 New order session started and frontend cart cleared");
    } catch (e) {
      console.error("Failed to start new order:", e);
    } finally {
      setProcessing(false);
      navigate("/");
    }
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
          <Typography variant="h5" color="error">
            {error}
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Logo large />
        <Typography variant="h3" gutterBottom>
          ✅ Order Complete!
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
            color: "#000000dd",
          }}
        >
          <Typography variant="h6">Order ID: {receipt?.orderId}</Typography>
          <Typography variant="body1">Type: {receipt?.orderType}</Typography>
          <Typography variant="body1" gutterBottom>
            Date: {receipt?.dateTime ? new Date(receipt.dateTime).toLocaleString() : "N/A"}
          </Typography>

          <hr />

          <Typography variant="h6" gutterBottom>
            Items:
          </Typography>

          {receipt?.receiptItems && receipt.receiptItems.length > 0 ? (
            receipt.receiptItems.map((item, i) => (
              <Box key={i} sx={{ mb: "12px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.quantity}x {item.itemName} ({item.itemSize})
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₱{item.subtotal?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                {/* ✅ Added individual price display */}
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right" }}>
                  ₱{item.itemPrice?.toFixed(2) || "0.00"}
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
            Total: ₱{receipt?.totalPrice?.toFixed(2) || "0.00"}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ marginTop: "20px", color: "#fff" }}>
          Pick up your order at the counter
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className={styles.largeButton}
          sx={{ marginTop: "30px" }}
          onClick={handleOrderAgain}
          disabled={processing}
        >
          {processing ? "Starting new order..." : "🆕 Order Again"}
        </Button>
      </Box>
    </Box>
  );
}