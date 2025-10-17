import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Store } from '../Store';
import { addToOrder, removeFromOrder } from '../actions';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function ReviewScreen() {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const styles = useStyles();

  const { orderItems, itemsCount, totalPrice, orderType } = state.order;

  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});

  const closeHandler = () => setIsOpen(false);
  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };
  const addToOrderHandler = async () => {
    try {
      // Add to local state
      addToOrder(dispatch, { ...product, quantity });
      setIsOpen(false);

      // Sync with backend
      await fetch(`http://localhost:7000/order/${product.itemCategorySelected}/${product.itemId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          itemQuantity: quantity,
        }),
      });
      console.log("✅ Synced item to backend cart:", product.name);
    } catch (error) {
      console.error("❌ Failed to sync item to backend:", error);
    }
  };

  const cancelOrRemoveFromOrder = async () => {
    try {
      // Remove from frontend state
      removeFromOrder(dispatch, product);
      setIsOpen(false);

      // Remove from backend cart
      const response = await fetch("http://localhost:7000/order/cart/view/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: product.itemId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to remove item:", errorText);
        alert("Failed to remove item from backend cart.");
      } else {
        console.log("✅ Item removed from backend cart:", product.name);
      }
    } catch (error) {
      console.error("❌ Error removing item from backend:", error);
      alert("Something went wrong while removing item.");
    }
  };

  
  const proceedToCheckoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:7000/order/cart/view/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Checkout failed:", errorText);
        alert("Checkout failed. Please add items first.");
        return;
      }

      console.log("✅ Checkout successful!");
      navigate("/payment");
    } catch (error) {
      console.error("❌ Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const cancelOrderHandler = async () => {
    try {
      const response = await fetch("http://localhost:7000/order/cart/view/cancel", {
        method: "POST",
      });

      if (response.ok) {
        alert("Order cancelled successfully!");
        dispatch({ type: "ORDER_CLEAR" }); // clear frontend store
        navigate("/"); // Go back to home
      } else {
        const errorText = await response.text();
        console.error("❌ Cancel failed:", errorText);
        alert("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error cancelling order:", error);
      alert("Something went wrong while cancelling order.");
    }
  };

  return (
    <Box className={styles.root}>
      <Box className={`${styles.main} ${styles.red} ${styles.center}`}>
        <Dialog maxWidth="sm" fullWidth open={isOpen} onClose={closeHandler}>
          <DialogTitle className={styles.center}>Add {product.name}</DialogTitle>
          <Box className={`${styles.row} ${styles.center}`}>
            <Button
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput, min: 1 }}
              className={styles.largeNumber}
              type="number"
              variant="filled"
              value={quantity}
            />
            <Button variant="contained" color="primary" onClick={() => setQuantity(quantity + 1)}>
              <AddIcon />
            </Button>
          </Box>
          <Box className={`${styles.row} ${styles.around}`}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              {orderItems.find((x) => x.name === product.name) ? 'Remove From Order' : 'Cancel'}
            </Button>
            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              ADD To Order
            </Button>
          </Box>
        </Dialog>

        <Box className={`${styles.center} ${styles.column}`}>
          <Logo large />
          <Typography gutterBottom className={styles.title} variant="h3">
            Review my {orderType} order
          </Typography>
        </Box>

        <Grid container>
          {orderItems.map((orderItem) => (
            <Grid item md={12} key={orderItem.name}>
              <Card className={styles.card} onClick={() => productClickHandler(orderItem)}>
                <CardActionArea>
                  <CardContent>
                    <Box className={`${styles.row} ${styles.between}`}>
                      <Typography variant="body2" color="textPrimary">
                        {orderItem.name}
                      </Typography>
                      <Button variant="contained">Edit</Button>
                    </Box>
                    <Box className={`${styles.row} ${styles.between}`}>
                      <Typography variant="body2" color="textPrimary">
                        {orderItem.quantity} x ₱{orderItem.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={`${styles.row} ${styles.around}`}>
            <Button
              onClick={() => navigate('/order')}
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Back
            </Button>

            <Button
              onClick={proceedToCheckoutHandler}
              variant="contained"
              color="secondary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Proceed To Checkout
            </Button>

            <Button
              onClick={cancelOrderHandler}
              variant="contained"
              color="error"
              className={styles.largeButton}
              style={{
                backgroundColor: '#b71c1c',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#d32f2f')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#b71c1c')}
            >
              Cancel Order
            </Button>
          </Box>
    </Box>
  );
}
