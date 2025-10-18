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

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        let id = orderId;
        if (!id) id = localStorage.getItem("orderId");
        if (!id) throw new Error("No order ID available to fetch the receipt.");

        const res = await fetch(`http://localhost:7000/order/receipt/${id}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setReceipt(data);
        localStorage.removeItem("orderId");
      } catch (err) {
        console.error("❌ Failed to fetch receipt:", err);
        setError("Could not load receipt. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [orderId]);

  const handleOrderAgain = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      await axios.post("http://localhost:7000/order/start");
      dispatch({ type: ORDER_CLEAR });
      localStorage.removeItem("orderId");
    } catch (e) {
      console.error("Failed to start new order:", e);
    } finally {
      setProcessing(false);
      navigate("/");
    }
  };

  if (loading)
    return (
      <Box
        className={`${styles.root}`}
        sx={{
          backgroundColor: "#00b020",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );

  if (error)
    return (
      <Box
        className={`${styles.root}`}
        sx={{
          backgroundColor: "#00b020",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#fff",
            color: "#00b020",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    );

  return (
    <Box
      className={`${styles.root}`}
      sx={{
        backgroundColor: "#00b020",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Logo large />
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 700,
          textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        ✅ Order Complete!
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "24px",
          marginTop: "24px",
          width: "85%",
          maxWidth: "420px",
          maxHeight: "380px",
          overflowY: "auto",
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
          textAlign: "left",
          color: "#333",
          backdropFilter: "blur(4px)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.08)",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.18)",
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Order ID: {receipt?.orderId}
        </Typography>
        <Typography variant="body1" sx={{ color: "#444" }}>
          Type: {receipt?.orderType}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: "#666" }}>
          Date:{" "}
          {receipt?.dateTime
            ? new Date(receipt.dateTime).toLocaleString()
            : "N/A"}
        </Typography>

        <hr />

        <Typography variant="h6" gutterBottom sx={{ mt: 1, fontWeight: 700 }}>
          Items:
        </Typography>

        {receipt?.receiptItems?.length > 0 ? (
          receipt.receiptItems.map((item, i) => (
            <Box key={i} sx={{ mb: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.quantity}x {item.itemName} ({item.itemSize})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#00b020", fontWeight: 700 }}
                >
                  ₱{item.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  color: "#999",
                  fontStyle: "italic",
                }}
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

        <hr />
        <Typography
          variant="h6"
          align="right"
          sx={{ fontWeight: 700, color: "#00b020" }}
        >
          Total: ₱{receipt?.totalPrice?.toFixed(2) || "0.00"}
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ marginTop: "20px", color: "#fff" }}>
        Pick up your order at the counter
      </Typography>

      <Button
        variant="contained"
        sx={{
          marginTop: "30px",
          backgroundColor: "#fff",
          color: "#00b020",
          fontWeight: 700,
          borderRadius: "12px",
          padding: "10px 40px",
          fontSize: "1.1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
          },
        }}
        onClick={handleOrderAgain}
        disabled={processing}
      >
        {processing ? "Starting new order..." : "Order Again"}
      </Button>
    </Box>
  );
}
