import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  ListItem,
  Avatar,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToOrder, clearOrder, listCategories, listProducts, removeFromOrder } from '../actions';
import { Store } from '../Store';
import Logo from '../components/Logo';
import { useStyles } from '../styles';
import { useNavigate } from 'react-router-dom';
import categories from '../categoryData';

export default function OrderScreen(props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});

  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  const { products, loading: loadingProducts, error: errorProducts } = state.productList;
  const { orderItems = [], taxPrice = 0, totalPrice = 0, itemsCount = 0, orderType = 'Dine In' } = state.order || {};


  useEffect(() => {
    listCategories(dispatch);
  }, [dispatch]);

  useEffect(() => {
    listProducts(dispatch, categoryName);
  }, [dispatch, categoryName]);

  const categoryClickHandler = (name) => {
    setCategoryName(name);
    listProducts(dispatch, name);
  };

  const productClickHandler = (p) => {
    setProduct(p);
    const existing = orderItems.find((x) => x.name === p.name);
    setQuantity(existing ? existing.quantity : 1);
    setIsOpen(true);
  };

  // OrderScreen.js — inside component
  const addToOrderhandler = async () => {
    try {
      const category = (product.itemCategorySelected || "WHATS_NEW").toUpperCase();
      const itemId = product.itemId || product.id;

      console.log(`🛒 Adding item ${itemId} from category ${category}...`);

      // Build payload exactly as actions.addToOrder expects
      const payload = {
        itemId: itemId,
        itemName: product.name || product.itemName,
        itemPrice: product.price || product.itemPrice,
        itemQuantity: quantity || 1,
        itemSize: product.itemSize || product.size || "M",
        itemCategorySelected: category,
        itemImageUrl: product.image || product.itemImageUrl || "",
      };

      // Call the centralized action which will POST to backend once and update store
      await addToOrder(dispatch, payload);

      console.log(`✅ Added to order: ${product.name}`);
      setIsOpen(false);
    } catch (err) {
      console.error("❌ Failed to add item:", err);
      alert("Could not add item. Please try again.");
    }
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const previewOrderHandler = () => {
    navigate('/review');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
        position: 'relative', // needed for bottom bar positioning
      }}
    >
      {/* ===== PRODUCT MODAL ===== */}
      <Dialog maxWidth="sm" fullWidth open={isOpen} onClose={closeHandler}>
        <DialogTitle className={styles.center}>Add {product.name}</DialogTitle>
        <Box className={[styles.row, styles.center]}>
          <Button
            variant="contained"
            color="primary"
            disabled={quantity === 1}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <RemoveIcon />
          </Button>
          <TextField
            inputProps={{ className: styles.largeInput }}
            InputProps={{
              bar: true,
              inputProps: { className: styles.largeInput },
            }}
            className={styles.largeNumber}
            type="number"
            variant="filled"
            min={1}
            value={quantity}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setQuantity(quantity + 1)}
          >
            <AddIcon />
          </Button>
        </Box>

        <Box className={[styles.row, styles.around]} sx={{ mt: 2 }}>
          <Button
            onClick={cancelOrRemoveFromOrder}
            variant="contained"
            color="error"
            size="large"
            className={styles.largeButton}
          >
            {orderItems.find((x) => x.name === product.name)
              ? 'Remove From Order'
              : 'Cancel'}
          </Button>
          <Button
            onClick={addToOrderhandler}
            variant="contained"
            color="primary"
            size="large"
            className={styles.largeButton}
          >
            Add to Order
          </Button>
        </Box>
      </Dialog>

      {/* ===== LEFT SIDEBAR ===== */}
      <Box
        sx={{
          width: 150,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingY: 3,
          paddingX: 1,
          borderRight: '3px solid #f5f5f5',
          boxShadow: '4px 0 8px rgba(0,0,0,0.05)',
          height: '100vh',
          overflowY: 'hidden',
          position: 'sticky',
          top: 0,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Logo />
            </Box>
            {categories.map((category) => (
              <ListItem
                key={category.name}
                disablePadding
                sx={{
                  mb: 2,
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => categoryClickHandler(category.name)}
              >
                <Avatar
                  alt={category.name}
                  src={category.image}
                  sx={{
                    width: 70,
                    height: 70,
                    border:
                      categoryName === category.name
                        ? '3px solid #ff2040'
                        : '3px solid transparent',
                    borderRadius: '20%',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: '#ff2040',
                    },
                  }}
                />
              </ListItem>
            ))}
          </>
        )}
      </Box>

      {/* ===== MAIN MENU (CENTER) ===== */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 4,
          pb: 12, // add bottom padding so content doesn’t hide behind the bar
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: '#ff2040',
            mb: 3,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {categoryName || 'Main Menu'}
        </Typography>

        {loadingProducts ? (
          <CircularProgress />
        ) : errorProducts ? (
          <Alert severity="error">{errorProducts}</Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {products.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4}
                key={product.name}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: '0.3s ease',
                    width: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                    },
                  }}
                  onClick={() =>
                    productClickHandler({
                      ...product,
                      itemCategorySelected: categoryName, // ✅ include category for backend
                      itemId: product.id || product.itemId, // ✅ ensure itemId is passed too
                    })
                  }
                >

                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.image}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'contain',
                        backgroundColor: '#ffffff',
                      }}
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography
                        gutterBottom
                        variant="body1"
                        sx={{ fontWeight: 600 }}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₱{product.price}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ===== BOTTOM CENTER ORDER SUMMARY BAR ===== */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          borderTop: '2px solid #f5f5f5',
          borderRadius: '12px 12px 0 0',
          padding: 2,
          width: '70%',
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 999,
        }}
      >
        <Box
          className={`${styles.bordered} ${styles.space}`}
          sx={{
            border: '1px solid #ccc',
            borderRadius: 1,
            padding: 1,
            fontWeight: 500,
            width: '100%',
            textAlign: 'center',
            mb: 2,
          }}
        >
          My Order -  {orderType}   |      Total:  ₱{totalPrice}      | Items:  {itemsCount}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            onClick={() => {
              clearOrder(dispatch);
              navigate('/');
            }}
            variant="contained"
            color="error"
            fullWidth
          >
            Cancel Order
          </Button>

          <Button
            onClick={previewOrderHandler}
            variant="contained"
            color="primary"
            fullWidth
            disabled={orderItems.length === 0}
          >
            View Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
