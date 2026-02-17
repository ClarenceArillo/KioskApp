import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStyles } from "../styles";

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

        const { data } = await axios.get(`http://localhost:7000/order/receipt/${orderId}`);

        // ✅ Restore fallbacks like your original
        setReceipt({
          restaurantName: data.restaurantName || "Aya sa Hapag - Makati",
          restaurantAddress:
            data.restaurantAddress || "Makati Avenue, Poblacion, Makati City",
          contactNumber: data.contactNumber || "(+63) 927-531-4820",
          email: data.email || "ayasahapagmkt@gmail.com",

          orderId: data.orderId ?? orderId,
          orderType: data.orderType || "N/A",
          orderDateTime: data.orderDateTime || new Date().toISOString(),
          totalPrice: data.totalPrice || 0,

          // ✅ Safe array
          receiptItems: Array.isArray(data.receiptItems) ? data.receiptItems : [],
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch receipt");
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  const handleDone = () => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) return navigate("/");
    navigate(`/completeorder/${orderId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundImage: "url(/images/receipt-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Spectral", serif',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className={`${styles.root}`}
        sx={{
          backgroundImage: "url(/images/receipt-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Spectral", serif',
          p: 3,
          pb: 16, // 👈 prevents the fixed button from overlapping
        }}
      >
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
    <Box
      sx={{
        backgroundImage: "url(/images/receipt-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Spectral", serif',
      }}
    >
      {/* ✅ RECEIPT CARD */}
      <Box
        sx={{
          fontFamily: '"Spectral", serif',
          backgroundColor: "#FFF8E7",
          borderRadius: "18px",
          padding: "26px",
          width: "80%",
          maxWidth: "420px",
          maxHeight: "470px",
          overflowY: "auto",
          border: "3px solid #304123",
          boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
          color: "#2d2926",
          mt: -10,
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
        }}
      >
{/* HEADER */}
<Typography
  variant="h4"
  align="center"
  gutterBottom
  sx={{
    fontFamily: '"Spectral", serif',
    color: "#ed7319",          // 👈 orange restaurant name
    textShadow: "0px 1px 4px rgba(150, 54, 28, 0.34)",
    fontWeight: 900,           // 👈 thicker
    fontSize: "2rem",          // 👈 slightly larger
    letterSpacing: 0.4,
  }}
>
  {receipt.restaurantName}
</Typography>

<Typography
  align="center"
  variant="body1"
  sx={{
    fontWeight: 600,
    fontSize: "1rem",
  }}
>
  {receipt.restaurantAddress}
</Typography>

<Typography
  align="center"
  variant="body1"
  sx={{
    fontWeight: 600,
    fontSize: "1rem",
  }}
>
  {receipt.contactNumber}
</Typography>

<Typography
  align="center"
  variant="body1"
  gutterBottom
  sx={{
    fontWeight: 600,
    fontSize: "1rem",
  }}
>
  {receipt.email}
</Typography>

<Divider sx={{ my: 1.2, borderColor: "rgba(48,65,35,0.25)" }} />


        {/* ITEMS TITLE */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontFamily: '"Spectral", serif',
            fontWeight: 700,
            color: "#304123",
            textShadow: "0px 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          Items
        </Typography>

        {/* ITEMS LIST */}
        {receipt.receiptItems.length > 0 ? (
          receipt.receiptItems.map((item, index) => (
            <Box
              key={index}
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
                  variant="body2"
                  sx={{
                    color: "#2d2926",
                    fontWeight: 600,
                  }}
                >
                  {item.quantity}x {item.itemName} ({item.itemSize})
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Spectral", serif',
                    fontWeight: 700,
                    color: "#ed7319",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₱{item.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: "rgba(45,41,38,0.65)",
                  textAlign: "right",
                  display: "block",
                  mt: 0.3,
                }}
              >
                ₱{item.itemPrice?.toFixed(2) || "0.00"} each
              </Typography>
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ fontFamily: '"Spectral", serif', color: "rgba(45,41,38,0.7)" }}
          >
            No items found in this receipt.
          </Typography>
        )}

        <Divider sx={{ my: 1.2, borderColor: "rgba(48,65,35,0.25)" }} />

        {/* TOTAL */}
        <Typography
          variant="h6"
          align="right"
          sx={{
            fontFamily: '"Spectral", serif',
            fontWeight: 800,
            color: "#304123",
          }}
        >
          Total: ₱{Number(receipt.totalPrice || 0).toFixed(2)}
        </Typography>
      </Box>

      {/* DONE BUTTON (IMAGE, STILL CLICKABLE) */}
      <Button
        onClick={handleDone}
        sx={{
          position: "fixed",
          bottom: 90,                  // 👈 move up/down here
          left: "50%",
          transform: "translateX(-50%)",
          p: 0,
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          "&:hover img": { transform: "scale(1.05)" },
          zIndex: 10,
        }}
      >
        <Box
          component="img"
          src="/images/done-btn.png"
          alt="Done"
          sx={{
            height: 85,
            transition: "transform 0.3s ease",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </Button>
    </Box>
  );
}
