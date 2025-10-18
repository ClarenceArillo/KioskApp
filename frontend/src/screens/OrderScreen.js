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

  const addToOrderhandler = async () => {
    try {
      const category = (product.itemCategorySelected || "WHATS_NEW").toUpperCase();
      const itemId = product.itemId || product.id;

      console.log(`🛒 Adding item ${itemId} from category ${category}...`);

      const payload = {
        itemId: itemId,
        itemName: product.name || product.itemName,
        itemPrice: product.price || product.itemPrice,
        itemQuantity: quantity || 1,
        itemSize: product.itemSize || product.size || "M",
        itemCategorySelected: category,
        itemImageUrl: product.image || product.itemImageUrl || "",
      };

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

  // Function to format category names for display
  const formatCategoryName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
        position: 'relative',
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

      {/* ===== LEFT SIDEBAR (Enhanced Category Design) ===== */}
      <Box
        sx={{
          width: 240, // widened sidebar
          background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingY: 3,
          paddingX: 2,
          borderRight: '1px solid #f0f0f0',
          boxShadow: '6px 0 12px rgba(0,0,0,0.04)',
          height: '100vh',
          overflowY: 'auto',
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
            <Box
              sx={{
                mb: 6,
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'scale(1.4)', // makes logo ~40% bigger
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.45)', // subtle hover emphasis
                },
              }}
            >
              <Logo large />
            </Box>

            {categories.map((category) => {
              const isSelected = categoryName === category.name;
              return (
                <Box
                  key={category.name}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    mb: 3,
                    cursor: 'pointer',
                    width: '100%',
                    minHeight: 'clamp(160px, 18vh, 220px)', // ✅ fixed but responsive height
                    borderRadius: '18px',
                    padding: '16px 12px',
                    backgroundColor: isSelected ? '#ff2040' : '#ffffff',
                    boxShadow: isSelected
                      ? '0 8px 20px rgba(255,32,64,0.25)'
                      : '0 3px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      backgroundColor: isSelected ? '#e61a36' : '#fff5f5',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => categoryClickHandler(category.name)}
                >
                  <Avatar
                    alt={category.name}
                    src={category.image}
                    sx={{
                      width: 'clamp(80px, 9vw, 110px)', // ✅ image scales but keeps proportion
                      height: 'clamp(80px, 9vw, 110px)',
                      borderRadius: '18px',
                      backgroundColor: '#ffffff',
                      objectFit: 'cover',
                      boxShadow: isSelected
                        ? '0 6px 18px rgba(255,255,255,0.35)'
                        : '0 3px 10px rgba(0,0,0,0.08)',
                      transition: '0.3s ease',
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 2,
                      fontWeight: 800,
                      fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', // ✅ responsive font
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: isSelected ? '#ffffff' : '#333333',
                      textAlign: 'center',
                      fontFamily: '"Poppins", "Roboto", sans-serif',
                      transition: 'color 0.3s ease',
                      lineHeight: 1.2,
                    }}
                  >
                    {formatCategoryName(category.name)}
                  </Typography>
                </Box>

              );
            })}
          </>
        )}
      </Box>



      {/* ===== MAIN MENU (CENTER) ===== */}
      {/* ===== MAIN MENU (CENTER) ===== */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          position: 'relative',
          p: 4,
          pb: 12,
        }}
      >
        {categoryName === '' ? (
          // ✅ Display Menu Poster when no category is selected
          <Box
            sx={{
              width: '100%',
              height: 'calc(100vh - 100px)', // fills visible area under header
              backgroundImage: `url("images/MenuImg.png")`, // <-- file should be in /public
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '12px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)',
            }}
          />
        ) : (
          <>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: '800',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                color: '#ff2040',
                mb: 4,
                textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px',
              }}
            >
              {formatCategoryName(categoryName) || 'MAIN MENU'}
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
                          itemCategorySelected: categoryName,
                          itemId: product.id || product.itemId,
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
                            sx={{
                              fontWeight: 700,
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontWeight: 600,
                              color: '#ff2040',
                            }}
                          >
                            ₱{product.price}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
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
          My Order - {orderType} | Total: ₱{totalPrice} | Items: {itemsCount}
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