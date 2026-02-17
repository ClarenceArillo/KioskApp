import React, { useEffect, useState, useContext } from "react";
import { Box, Button, Typography, CircularProgress, Alert, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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

        // ✅ Add fallbacks so header always shows (like your original receipt screen)
        setReceipt({
          restaurantName: data.restaurantName || "Aya sa Hapag - Makati",
          restaurantAddress:
            data.restaurantAddress || "Makati Avenue, Poblacion, Makati City",
          contactNumber: data.contactNumber || "(+63) 927-531-4820",
          email: data.email || "ayasahapagmkt@gmail.com",
          orderId: data.orderId ?? id,
          orderType: data.orderType || "N/A",
          orderDateTime: data.orderDateTime || data.dateTime || new Date().toISOString(),
          totalPrice: data.totalPrice || 0,
          receiptItems: Array.isArray(data.receiptItems) ? data.receiptItems : [],
        });

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

  const pageSx = {
    backgroundImage: "url(/images/complete-bg.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Spectral", serif',
    overflow: "hidden",
    
    pb: 16, // ✅ space so fixed button doesn't overlap content
  };

  if (loading) {
    return (
      <Box className={`${styles.root}`} sx={pageSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={`${styles.root}`} sx={{ ...pageSx, p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#FFF8E7",
            color: "#304123",
            fontWeight: 700,
            fontFamily: '"Spectral", serif',
            "&:hover": { backgroundColor: "#f5ecd6" },
            
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box className={`${styles.root}`} sx={pageSx}>
      {/* ✅ RECEIPT-STYLE CARD */}
      <Box
        sx={{
          backgroundColor: "#FFF8E7",
          borderRadius: "18px",
          padding: "26px",
          width: "80%",
          maxWidth: "520px",
          maxHeight: "500px",
          overflowY: "auto",
          border: "3px solid #304123",
          boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
          color: "#2d2926",
          fontFamily: '"Spectral", serif',
          transform: "translateY(35px)", // 👈 moves container DOWN (adjust 40–120)


          // ✅ cream scrollbar pill only
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            marginTop: "30px",
            marginBottom: "30px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 248, 231, 0.6)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255, 248, 231, 0.9)",
          },

          // ✅ move slightly up/down if needed
          mt: -2,
        }}
      >
        {/* HEADER (no logo) */}
        <Typography
          align="center"
          sx={{
            fontFamily: '"Spectral", serif',
            color: "#ed7319", // ✅ orange
            fontWeight: 900,
            fontSize: "2rem",
            letterSpacing: 0.4,
            textShadow: "0px 1px 4px rgba(150, 54, 28, 0.34)",
            mb: 0.5,
          }}
        >
          {receipt.restaurantName}
        </Typography>

        <Typography
          align="center"
          variant="body1"
          sx={{fontWeight: 600 }}
        >
          {receipt.restaurantAddress}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{fontWeight: 600 }}
        >
          {receipt.contactNumber}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          gutterBottom
          sx={{fontWeight: 600 }}
        >
          {receipt.email}
        </Typography>

        <Divider sx={{ my: 1.2, borderColor: "rgba(48,65,35,0.25)" }} />

        {/* ORDER INFO */}
        <Typography sx={{ fontFamily: '"Spectral", serif', fontSize: "1.05rem" }}>
          <strong>Order ID:</strong> {receipt.orderId}
        </Typography>
        <Typography sx={{ fontFamily: '"Spectral", serif', fontSize: "1.05rem" }}>
          <strong>Order Type:</strong> {receipt.orderType}
        </Typography>
        <Typography
          gutterBottom
          sx={{ fontFamily: '"Spectral", serif', fontSize: "1.05rem" }}
        >
          <strong>Date:</strong> {new Date(receipt.orderDateTime).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 1.2, borderColor: "rgba(48,65,35,0.25)" }} />

        {/* ITEMS */}
        <Typography
          sx={{
            fontFamily: '"Spectral", serif',
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#304123",
            mb: 1,
          }}
        >
          Items
        </Typography>

        {receipt.receiptItems.length > 0 ? (
          receipt.receiptItems.map((item, i) => (
            <Box
              key={i}
              sx={{
                mb: 1.5,
                borderBottom: "1px dashed rgba(48,65,35,0.25)",
                pb: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spectral", serif',
                    fontWeight: 600,
                    color: "#2d2926",
                    fontSize: "1rem",
                  }}
                >
                  {item.quantity}x {item.itemName} ({item.itemSize})
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Spectral", serif',
                    fontWeight: 800,
                    color: "#ed7319",
                    whiteSpace: "nowrap",
                    fontSize: "1.05rem",
                  }}
                >
                  ₱{item.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: '"Spectral", serif',
                  color: "rgba(45,41,38,0.65)",
                  textAlign: "right",
                  display: "block",
                  mt: 0.3,
                  fontSize: "0.85rem",
                }}
              >
                ₱{item.itemPrice?.toFixed(2) || "0.00"} each
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ fontFamily: '"Spectral", serif', color: "rgba(45,41,38,0.7)" }}>
            No items found in this receipt.
          </Typography>
        )}

        <Divider sx={{ my: 1.2, borderColor: "rgba(48,65,35,0.25)" }} />

        {/* TOTAL */}
        <Typography
          align="right"
          sx={{
            fontFamily: '"Spectral", serif',
            fontWeight: 900,
            color: "#304123",
            fontSize: "1.25rem",
          }}
        >
          Total: ₱{Number(receipt.totalPrice || 0).toFixed(2)}
        </Typography>
      </Box>

      {/* ✅ IMAGE BUTTON (fixed, clickable, doesn't move card) */}
      <Button
        onClick={handleOrderAgain}
        disabled={processing}
        sx={{
          position: "fixed",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          p: 0,
          bottom: 100,              // ✅ higher = more up

          minWidth: "unset",
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          "&:hover img": { transform: "scale(1.05)" },
          "&:active img": { transform: "scale(0.99)" },
          zIndex: 10,
          opacity: processing ? 0.75 : 1,
        }}
      >
        <Box
          component="img"
          src="/images/orderagain-btn.png"  // ✅ button image filename you gave
          alt="Order Again"
          sx={{
            height: 85,
            width: "auto",
            objectFit: "contain",
            transition: "transform 0.25s ease",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </Button>
    </Box>
  );
}
