import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Backdrop,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Store } from '../Store';
import { addToOrder, removeFromOrder } from '../actions';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function ReviewScreen() {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const { orderItems, totalPrice, orderType } = state.order;

  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const closeHandler = () => setIsOpen(false);

  const productClickHandler = (p) => {
    setProduct(p);
    setQuantity(p.quantity || 1);
    setIsOpen(true);
  };

  const addToOrderHandler = async () => {
  // 🧱 Prevent crash for invalid quantity
  if (!quantity || isNaN(quantity) || quantity <= 0) {
    alert('Please enter a valid quantity.');
    return;
  }

  setIsOpen(false);

try {
  const response = await fetch(
    `http://localhost:7000/order/cart/view/update?id=${product.itemId}&quantity=${quantity}&size=${product.size || 'M'}`,
    { method: 'PUT' }
  );
  if (!response.ok) throw new Error('Failed to update quantity');

  // ✅ Update context state locally to match
  const updatedItem = { ...product, quantity };
  dispatch({
    type: 'ORDER_UPDATE_ITEM',
    payload: updatedItem,
  });
} catch (error) {
  console.error('❌ Error updating quantity:', error);
  alert('Failed to update quantity. Please try again.');
}

};


  const cancelOrRemoveFromOrder = async () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
    await fetch('http://localhost:7000/order/cart/view/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: product.itemId }),
    });
  };

  const proceedToCheckoutHandler = async () => {
    const response = await fetch('http://localhost:7000/order/cart/view/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) navigate('/payment');
    else alert('Checkout failed. Please add items first.');
  };

  const handleCancelClick = () => {
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    const response = await fetch('http://localhost:7000/order/cart/view/cancel', {
      method: 'POST',
    });
    if (response.ok) {
      alert('Order cancelled!');
      dispatch({ type: 'ORDER_CLEAR' });
      setCancelConfirmOpen(false);
      navigate('/');
    } else alert('Failed to cancel order.');
  };

  const handleCancelDecline = () => {
    setCancelConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
        pb: 8,
      }}
    >
      {/* === CANCEL ORDER CONFIRMATION DIALOG === */}
      <Dialog
        open={cancelConfirmOpen}
        onClose={handleCancelDecline}
        maxWidth="sm"
        fullWidth
        slots={{
          backdrop: (props) => (
            <Backdrop
              {...props}
              sx={{
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ),
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 0 35px rgba(255,255,255,0.6)',
            border: '2px solid #f1f1f1',
            backgroundColor: '#fff',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.3rem',
            color: '#ff2040',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          Cancel Order?
        </DialogTitle>

        <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              fontSize: '1.05rem',
              mb: 3,
            }}
          >
            Are you sure you want to cancel this order? All items will be removed.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              onClick={handleCancelDecline}
              variant="contained"
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: '#999',
                '&:hover': { backgroundColor: '#777' },
                textTransform: 'none',
              }}
            >
              No, Keep Order
            </Button>

            <Button
              onClick={handleConfirmCancel}
              variant="contained"
              color="error"
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Yes, Cancel Order
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* === EDIT ITEM MODAL === */}
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
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
            />
          ),
        }}
        PaperProps={{
          sx: {
            width: '45%',
            maxWidth: 340,
            borderRadius: 4,
            boxShadow: '0 0 35px rgba(255,255,255,0.6)',
            border: '2px solid #f1f1f1',
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.3rem',
            color: '#ff2040',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          Edit {product.name}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              disabled={quantity === 1}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              sx={{
                backgroundColor: '#ff2040',
                '&:hover': { backgroundColor: '#e01b36' },
                borderRadius: 2,
              }}
            >
              <RemoveIcon />
            </Button>

            <TextField
              inputProps={{
                style: {
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  width: '60px',
                },
              }}
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <Button
              variant="contained"
              onClick={() => setQuantity(quantity + 1)}
              sx={{
                backgroundColor: '#ff2040',
                '&:hover': { backgroundColor: '#e01b36' },
                borderRadius: 2,
              }}
            >
              <AddIcon />
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
              gap: 2,
            }}
          >
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="error"
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
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
                backgroundColor: '#ff2040',
                '&:hover': { backgroundColor: '#e01b36' },
                textTransform: 'none',
              }}
            >
              Update
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* === HEADER === */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          mb: 2,
        }}
      >
        <Box sx={{ transform: 'scale(1.2)', mb: 1 }}>
          <Logo />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#ff2040',
            textAlign: 'center',
            mb: 1,
          }}
        >
          Review My {orderType} Order
        </Typography>
      </Box>

      {/* === ORDER ITEMS BOX === */}
      <Box
        sx={{
          width: '45%',
          background: 'linear-gradient(180deg, #ffffff 0%, #fef6f6 100%)',
          borderRadius: 3,
          boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
          border: '1.5px solid rgba(255,255,255,0.7)',
          backdropFilter: 'blur(6px)',
          p: 3,
          mb: 4,
        }}
      >
        {orderItems.map((orderItem) => (
          <Card
            key={orderItem.name}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              mb: 2,
              transition: '0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(255,32,64,0.2)',
              },
            }}
            onClick={() => productClickHandler(orderItem)}
          >
            <CardActionArea>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                    px: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#333',
                      flex: 1,
                    }}
                  >
                    {orderItem.name}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 3,
                      minWidth: '120px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#777',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      {orderItem.quantity}×
                    </Typography>
                    <Typography
                      sx={{
                        color: '#ff2040',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      ₱{orderItem.price}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* === FROSTED-GLASS SUMMARY BAR === */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -3px 15px rgba(0,0,0,0.15)',
          borderRadius: '16px 16px 0 0',
          borderTop: '3px solid #ff2040',
          padding: 2,
          width: '45%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 999,
        }}
      >
        <Box
          sx={{
            border: '1.5px solid #ff2040',
            borderRadius: 3,
            padding: 1,
            fontWeight: 600,
            width: '100%',
            textAlign: 'center',
            mb: 1.5,
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 3px 8px rgba(255,32,64,0.2)',
          }}
        >
          My {orderType} Order | Total: ₱{totalPrice?.toFixed(2) || 0}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            onClick={() => navigate('/order')}
            variant="contained"
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              backgroundColor: '#ddd',
              color: '#000',
              '&:hover': { backgroundColor: '#ccc' },
              textTransform: 'none',
            }}
          >
            Back
          </Button>

          <Button
            onClick={proceedToCheckoutHandler}
            variant="contained"
            fullWidth
            disabled={orderItems.length === 0}
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              backgroundColor: '#ff2040',
              '&:hover': { backgroundColor: '#e01b36' },
              textTransform: 'none',
            }}
          >
            Proceed
          </Button>

          <Button
            onClick={handleCancelClick}
            variant="contained"
            color="error"
            sx={{
              flex: 1,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
