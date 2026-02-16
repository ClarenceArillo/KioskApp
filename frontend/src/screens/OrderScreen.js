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
  const [addingToOrder, setAddingToOrder] = useState(false);

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

  // ✅ Prevent race conditions: track pending requests
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (categoryName && isMounted) {
        await listProducts(dispatch, categoryName);
      }
    };

    // Small delay to debounce rapid category switches
    const timeoutId = setTimeout(fetchProducts, 150);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [categoryName, dispatch]);

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
    if (addingToOrder) return; // Prevent rapid clicks
    
    setAddingToOrder(true);
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
    } finally {
      setAddingToOrder(false);
    }
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const closeHandler = () => setIsOpen(false);
  const previewOrderHandler = () => navigate('/review');

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return '';
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
              disabled={addingToOrder}
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: '#ff2040',
                '&:hover': { backgroundColor: '#e01b36' },
                textTransform: 'none',
              }}
            >
              {addingToOrder ? 'Adding...' : 'Add to Order'}
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
            <Box
              sx={{
                mb: 3,
                transform: 'scale(1.4)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Logo />
            </Box>

            {categories.map((category) => {
              const isSelected = categoryName === category.name;
              return (
                <ListItem
                  key={category.name}
                  disablePadding
                  sx={{
                    mb: 2,
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                  onClick={() => categoryClickHandler(category.name)}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 90,
                      height: 90,
                      borderRadius: '25%',
                      backgroundColor: isSelected ? '#ff2040' : '#fff',
                      boxShadow: isSelected
                        ? '0 8px 20px rgba(255,32,64,0.5)'
                        : '0 4px 12px rgba(0,0,0,0.08)',
                      border: isSelected ? '3px solid #ff2040' : '2px solid #eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        boxShadow: '0 10px 25px rgba(255,32,64,0.5)',
                      },
                    }}
                  >
                    <Avatar
                      alt={category.name}
                      src={category.image}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '20%',
                        objectFit: 'contain',
                        backgroundColor: '#fff',
                      }}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        bottom: -24,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: isSelected ? '#ff2040' : '#444',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                      }}
                    >
                      {category.name.replace(/_/g, ' ')}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </>
        )}
      </Box>

      {/* ===== MAIN MENU ===== */}
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
        {/* ===== HEADER WITH SORT MENU ===== */}
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
            {categoryName ? formatCategoryName(categoryName) : "What's New"}
          </Typography>

          {/* Sort Menu - Only show when category is selected */}
          {categoryName && (
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
          )}

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

        {/* ===== MAIN CONTENT AREA ===== */}
        {categoryName === '' ? (
          // ✅ Display Menu Poster when no category is selected
          <Box
            sx={{
              width: '100%',
              height: 'calc(100vh - 100px)',
              backgroundImage: 'url("images/MenuImg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '12px',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3), 0 8px 25px rgba(0,0,0,0.15)',
              border: '3px solid #ff2040',
            }}
          />
        ) : (
          // ===== PRODUCT GRID WHEN CATEGORY IS SELECTED =====
          <>
            {loadingProducts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : errorProducts ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                ⚠️ Failed to load menu: {errorProducts}. Refresh the page or try another category.
              </Alert>
            ) : products && products.length > 0 ? (
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
                          height: 280,
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
                              height: 160,
                              width: '100%',
                              objectFit: 'contain',
                              backgroundColor: '#fff',
                              borderRadius: '20px 20px 0 0',
                              p: 1.5,
                              transition: 'transform 0.25s ease',
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
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No products available in this category.
              </Alert>
            )}
          </>
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