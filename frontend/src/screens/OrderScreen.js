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
  DialogContent,
  Backdrop,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SortIcon from '@mui/icons-material/Sort';
import {
  addToOrder,
  clearOrder,
  listCategories,
  listProducts,
  removeFromOrder,
} from '../actions';
import { Store } from '../Store';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function OrderScreen() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [sortOrder, setSortOrder] = useState('default');
  const [anchorEl, setAnchorEl] = useState(null);

  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  const { products, loading: loadingProducts, error: errorProducts } =
    state.productList;
  const {
    orderItems = [],
    totalPrice = 0,
    itemsCount = 0,
    orderType = 'Dine In',
  } = state.order || {};

  useEffect(() => {
    listCategories(dispatch);
  }, [dispatch]);

  useEffect(() => {
    listProducts(dispatch, categoryName);
  }, [dispatch, categoryName]);

  const openSortMenu = Boolean(anchorEl);
  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleSortClose = (option) => {
    if (option) setSortOrder(option);
    setAnchorEl(null);
  };

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
      const category = (product.itemCategorySelected || 'WHATS_NEW').toUpperCase();
      const itemId = product.itemId || product.id;

      const payload = {
        itemId,
        itemName: product.name || product.itemName,
        itemPrice: product.price || product.itemPrice,
        itemQuantity: quantity || 1,
        itemSize: product.itemSize || product.size || 'M',
        itemCategorySelected: category,
        itemImageUrl: product.image || product.itemImageUrl || '',
      };

      await addToOrder(dispatch, payload);
      setIsOpen(false);
    } catch (err) {
      console.error('❌ Failed to add item:', err);
      alert('Could not add item. Please try again.');
    }
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const closeHandler = () => setIsOpen(false);
  const previewOrderHandler = () => navigate('/review');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
      }}
    >
      {/* ===== PRODUCT MODAL ===== */}
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
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ),
        }}
        PaperProps={{
          sx: {
            width: '55%',
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: '0 0 35px rgba(255,255,255,0.6)',
            border: '2px solid #f1f1f1',
            backgroundColor: '#fff',
            paddingY: 1,
            transition: 'all 0.3s ease',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: '#ff2040',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          Add {product.name}
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
              {orderItems.find((x) => x.name === product.name)
                ? 'Remove From Order'
                : 'Cancel'}
            </Button>

            <Button
              onClick={addToOrderhandler}
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
              Add to Order
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ===== LEFT SIDEBAR ===== */}
      <Box
        sx={{
          width: 150,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          borderRight: '3px solid #f5f5f5',
          boxShadow: '4px 0 12px rgba(0,0,0,0.06)',
          height: '100vh',
          overflowY: 'hidden',
          flexShrink: 0,
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* LOGO */}
            <Box sx={{ mb: 3, transform: 'scale(1.2)' }}>
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
                    borderRadius: '25%',
                    transition: '0.3s ease',
                    boxShadow:
                      categoryName === category.name
                        ? '0 6px 18px rgba(255,32,64,0.4)'
                        : '0 3px 8px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'scale(1.07)',
                      boxShadow: '0 8px 20px rgba(255,32,64,0.4)',
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
          px: 5,
          pb: 12,
          background: 'linear-gradient(to bottom right, #ffffff, #fdfdfd)',
          borderRadius: '30px 0 0 30px',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
        }}
      >
        {/* ===== CATEGORY TITLE + SORT FILTER ===== */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            mt: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#ff2040',
            }}
          >
            {categoryName || "What's New"}
          </Typography>

          {/* Sort Filter Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: '#fff',
              border: '1.5px solid #f0f0f0',
              borderRadius: '10px',
              px: 2,
              py: 0.6,
              boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#ff2040',
                boxShadow: '0 4px 12px rgba(255,32,64,0.2)',
              },
            }}
            onClick={handleSortClick}
          >
            <SortIcon sx={{ color: '#ff2040' }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#444' }}>
              Sort by:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#ff2040',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {sortOrder === 'default'
                ? 'Default'
                : sortOrder === 'lowToHigh'
                ? 'Lowest Price'
                : 'Highest Price'}
            </Typography>
          </Box>

          {/* Sort Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openSortMenu}
            onClose={() => handleSortClose(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => handleSortClose('default')}
              selected={sortOrder === 'default'}
            >
              Default
            </MenuItem>
            <MenuItem
              onClick={() => handleSortClose('lowToHigh')}
              selected={sortOrder === 'lowToHigh'}
            >
              Price: Low to High
            </MenuItem>
            <MenuItem
              onClick={() => handleSortClose('highToLow')}
              selected={sortOrder === 'highToLow'}
            >
              Price: High to Low
            </MenuItem>
          </Menu>
        </Box>

        {/* ===== PRODUCT GRID ===== */}
        {loadingProducts ? (
          <CircularProgress />
        ) : errorProducts ? (
          <Alert severity="error">{errorProducts}</Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {[...products]
              .sort((a, b) => {
                if (sortOrder === 'lowToHigh') return a.price - b.price;
                if (sortOrder === 'highToLow') return b.price - a.price;
                return 0;
              })
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={product.name}>
                  <Card
                    sx={{
                      height: 260,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 4,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                      transition: '0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 10px 25px rgba(255,32,64,0.35)',
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
                    <CardActionArea sx={{ flexGrow: 1 }}>
                      <CardMedia
                        component="img"
                        alt={product.name}
                        image={product.image}
                        sx={{
                          height: 150,
                          objectFit: 'contain',
                          backgroundColor: '#ffffff',
                          borderRadius: '20px 20px 0 0',
                          p: 1,
                        }}
                      />
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <Typography
                          gutterBottom
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: '#333',
                            fontSize: '0.95rem',
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#ff2040', fontWeight: 600 }}
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
      </Box>

      {/* ===== BOTTOM ORDER SUMMARY BAR ===== */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          boxShadow: '0 -3px 15px rgba(0,0,0,0.15)',
          borderRadius: '16px 16px 0 0',
          borderTop: '3px solid #ff2040',
          padding: 2,
          width: '65%',
          maxWidth: 750,
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
            backgroundColor: '#fff',
            boxShadow: '0 3px 8px rgba(255,32,64,0.2)',
          }}
        >
          My Order — {orderType} | Total: ₱{totalPrice} | Items: {itemsCount}
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
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Cancel Order
          </Button>

          <Button
            onClick={previewOrderHandler}
            variant="contained"
            fullWidth
            disabled={orderItems.length === 0}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              backgroundColor: '#ff2040',
              '&:hover': { backgroundColor: '#e01b36' },
              textTransform: 'none',
            }}
          >
            View Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
