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
  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };
  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };
  const proceedToCheckoutHandler = () => navigate('/payment');

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

      <Box>
        <Box className={`${styles.bordered} ${styles.space}`}>
          My Order - {orderType === 'takeout' ? 'Take out' : 'Eat in'} | Total: ₱{totalPrice} | Items: {itemsCount}
        </Box>

        <Box className={`${styles.row} ${styles.around}`}>
          <Button onClick={() => navigate('/order')} variant="contained" color="primary" className={styles.largeButton}>
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
        </Box>
      </Box>
    </Box>
  );
}
