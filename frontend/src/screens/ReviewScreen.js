import React, { useContext, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

import { Store } from "../Store";
import { removeFromOrder } from "../actions";

export default function ReviewScreen() {
  /* ==============================
     CONTEXT / ROUTING
  ============================== */
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const { orderItems, totalPrice, orderType } = state.order;

  /* ==============================
     LOCAL STATE
  ============================== */
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  /* ==============================
     MODAL HELPERS
  ============================== */
  const closeHandler = () => setIsOpen(false);

  const productClickHandler = (p) => {
    setProduct(p);
    setQuantity(p.quantity || 1);
    setIsOpen(true);
  };

  /* ==============================
     API ACTIONS
  ============================== */
  const addToOrderHandler = async () => {
    // Prevent crash for invalid quantity
    if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    setIsOpen(false);

    try {
      const response = await fetch(
        `http://localhost:7000/order/cart/view/update?id=${product.itemId}&quantity=${quantity}&size=${
          product.size || "M"
        }`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update quantity");

      // Update context state locally to match backend
      dispatch({
        type: "ORDER_UPDATE_ITEM",
        payload: { ...product, quantity },
      });
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const cancelOrRemoveFromOrder = async () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);

    await fetch("http://localhost:7000/order/cart/view/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: product.itemId }),
    });
  };

  const proceedToCheckoutHandler = async () => {
    const response = await fetch("http://localhost:7000/order/cart/view/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) navigate("/payment");
    else alert("Checkout failed. Please add items first.");
  };

  const cancelOrderHandler = async () => {
    const response = await fetch("http://localhost:7000/order/cart/view/cancel", {
      method: "POST",
    });

    if (response.ok) {
      alert("Order cancelled!");
      dispatch({ type: "ORDER_CLEAR" });
      navigate("/");
    } else {
      alert("Failed to cancel order.");
    }
  };

  /* ==============================
     UI
  ============================== */
  return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
          pb: 8,
          position: 'relative',

          /* BACKGROUND IMAGE */
          backgroundImage: 'url(/images/review-bg.png)', // 👈 your image
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

      {/* ==============================
          EDIT ITEM MODAL
      ============================== */}
      <Dialog
        maxWidth="sm"
        fullWidth
        open={isOpen}
        onClose={closeHandler}
        slots={{
          backdrop: (props) => (
            <Backdrop
              {...props}
              sx={{
                backdropFilter: "blur(6px)",
                backgroundColor: "#30412311",
              }}
            />
          ),
        }}
        PaperProps={{
          sx: {
            width: "45%",
            maxWidth: 340,
            borderRadius: 4,
            boxShadow: "0 0 35px #3041237c",
            border: "5px solid #304123",
            backgroundColor: "#fff8e7",
            transition: "all 0.3s ease",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.3rem",
            color: "#2d2926",
            borderBottom: "1px solid #304123",
          }}
        >
          Edit {product?.name}
        </DialogTitle>

        <DialogContent>
          {/* Quantity Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              disabled={quantity === 1}
              onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
              sx={{
                backgroundColor: "#304123",
                "&:hover": { backgroundColor: "#2a3521" },
                borderRadius: 2,
              }}
            >
              <RemoveIcon />
            </Button>

            <TextField
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  width: "60px",
                  backgroundColor: "#fff8e7"
                  
                },
              }}
            />

            <Button
              variant="contained"
              onClick={() => setQuantity((q) => q + 1)}
              sx={{
                backgroundColor: "#304123",
                "&:hover": { backgroundColor: "#2a3521" },
                borderRadius: 2,
              }}
            >
              <AddIcon />
            </Button>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 2 }}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="error"
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                backgroundColor: "#ed7319",
                "&:hover": { backgroundColor: "#da620c" },
              }}
            >
              Remove Item
            </Button>

            <Button
              onClick={addToOrderHandler}
              variant="contained"
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "#ed7319",
                "&:hover": { backgroundColor: "#da620c" },
                textTransform: "none",
              }}
            >
              Update
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==============================
          HEADER
      ============================== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          mb: 2,
        }}
      >

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#ed7319",
            textAlign: "center",
            bottom: 100,
            mt: 17,
            textShadow: "0px 1px 4px rgba(218, 49, 3, 0.51)",
          }}
        >
          Review My {orderType} Order
        </Typography>
      </Box>

      {/* ==============================
          ORDER ITEMS LIST
      ============================== */}
        <Box
          sx={{
            width: '45%',
            backgroundColor: '#304123',
            borderRadius: 3,
            boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
            border: '1.5px solid rgba(255,255,255,0.7)',
            backdropFilter: 'blur(6px)',
            p: 3,
            mb: 12,
            maxHeight: '70vh',
            overflowY: 'auto',

            '&::-webkit-scrollbar': {
              width: '6px',
            },

            '&::-webkit-scrollbar-track': {
              background: 'transparent',
                marginTop: '30px',     // 👈 shortens top
                marginBottom: '30px',  // 👈 shortens bottom
            },

            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 248, 231, 0.6)', // 👈 semi-transparent cream
              borderRadius: '10px',
            },

            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 248, 231, 0.9)',
            },


          }}
        >


        {orderItems.map((orderItem) => (
          <Box
            key={orderItem.itemId ?? orderItem.name}
            sx={{
              backgroundColor: '#FFF8E7',   // 👈 cream capsule
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              mb: 2,
              transition: '0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(48,65,35,0.25)',
              },
            }}
            onClick={() => productClickHandler(orderItem)}
          >
            <CardActionArea>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 3,
                    px: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Spectral", serif',
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#2d2926',
                      textShadow: "0px 1px 4px rgba(0, 0, 0, 0.36)",
                      flex: 1,
                    }}
                  >
                    {orderItem.name}
                  </Typography>


                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 3,
                      minWidth: "120px",
                    }}
                  >
                  <Typography
                    sx={{
                      fontFamily: '"Spectral", serif',
                      color: "#6b6b6b",
                      fontWeight: 500,
                      fontSize: "1.4rem",
                      textShadow: "0px 1px 4px rgba(0, 0, 0, 0.41)",
                    }}
                  >
                    {orderItem.quantity}×
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Spectral", serif',
                      color: "#ed7319",
                      fontWeight: 600,
                      fontSize: "1.7rem",
                      textShadow: "0px 1px 4px rgba(218, 49, 3, 0.51)",
                    }}
                  >
                    ₱{orderItem.price}
                  </Typography>

                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Box>
        ))}
      </Box>

      {/* ==============================
          SUMMARY BAR (FIXED)
      ============================== */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#304123",
          backdropFilter: "blur(10px)",
          boxShadow: "0 -3px 15px rgba(0, 0, 0, 0.5)",
          borderRadius: "16px 16px 0 0",
          p: 2,
          width: "45%",
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <Box
          sx={{
            borderRadius: 3,
            p: 1,
            fontWeight: 600,
            width: "100%",
            textAlign: "center",
            mb: 1.5,
            backgroundColor: "#fff8e7",
            color: "#2d2926",
          }}
        >
          My {orderType} Order | Total: ₱{totalPrice?.toFixed(2) || 0}
        </Box>

        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button
            onClick={() => navigate("/order")}
            variant="contained"
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              backgroundColor: "#ddd",
              color: "#2d2926",
              "&:hover": { backgroundColor: "#ccc" },
              textTransform: "none",
            }}
          >
            Back
          </Button>

          <Button
            onClick={proceedToCheckoutHandler}
            variant="contained"
            disabled={orderItems.length === 0}
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              backgroundColor: "#ff2040",
              "&:hover": { backgroundColor: "#e01b36" },
              textTransform: "none",
            }}
          >
            Proceed
          </Button>

          <Button
            onClick={cancelOrderHandler}
            variant="contained"
            color="error"
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
