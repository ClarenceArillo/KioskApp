import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SortIcon from "@mui/icons-material/Sort";
import {
  addToOrder,
  clearOrder,
  listCategories,
  listProducts,
  removeFromOrder,
} from "../actions";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

export default function OrderScreen() {
  const navigate = useNavigate();

  // ===== THEME =====
  const COLORS = {
    cream: "#FFF8E7",
    green: "#304123",
    greenDark: "#223118",
    text: "#2d2926",
    orange: "#ed7319",
    muted: "rgba(45,41,38,0.70)",
    line: "rgba(48,65,35,0.25)",
  };

  // Sidebar width
  const SIDEBAR_WIDTH = 600;

  // Map category names -> image files (image-only sidebar buttons)
  const CATEGORY_IMG = {
    WHATS_NEW: "/images/whats-new.png",
    FAMILY_MEAL: "/images/family-meal.png",
    ALMUSAL: "/images/almusal.png",
    RICE_MEAL: "/images/rice-meal.png",
    MERYENDA: "/images/meryenda.png",
    PANGHIMAGAS: "/images/panghimagas.png",
  };

  const [categoryName, setCategoryName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [sortOrder, setSortOrder] = useState("default");
  const [anchorEl, setAnchorEl] = useState(null);

  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  const { products, loading: loadingProducts, error: errorProducts } =
    state.productList;

  const {
    orderItems = [],
    totalPrice = 0,
    itemsCount = 0,
    orderType = "Dine In",
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
      const category = (product.itemCategorySelected || "WHATS_NEW").toUpperCase();
      const itemId = product.itemId || product.id;

      const payload = {
        itemId,
        itemName: product.name || product.itemName,
        itemPrice: product.price || product.itemPrice,
        itemQuantity: quantity || 1,
        itemSize: product.itemSize || product.size || "M",
        itemCategorySelected: category,
        itemImageUrl: product.image || product.itemImageUrl || "",
      };

      await addToOrder(dispatch, payload);
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

  const closeHandler = () => setIsOpen(false);
  const previewOrderHandler = () => navigate("/review");

  const formatCategoryName = (name) => {
    if (!name) return "";
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // helper: get sidebar image for category
  const getCategoryButtonImg = (catName) => {
    const key = String(catName || "").toUpperCase();
    return CATEGORY_IMG[key] || ""; // if empty, we’ll fall back to category.image below
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",

        // ✅ Background image + cream base
        backgroundColor: COLORS.cream,
        backgroundImage: 'url("/images/order-bg.png")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ==============================
          PRODUCT MODAL
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
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0,0,0,0.15)",
              }}
            />
          ),
        }}
        PaperProps={{
          sx: {
            width: "55%",
            maxWidth: 420,
            borderRadius: 4,
            border: `2px solid ${COLORS.line}`,
            backgroundColor: COLORS.cream,
            boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
            paddingY: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: COLORS.green,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          Add {product.name}
        </DialogTitle>

        <DialogContent>
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
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              sx={{
                backgroundColor: COLORS.green,
                "&:hover": { backgroundColor: COLORS.greenDark },
                borderRadius: 2,
              }}
            >
              <RemoveIcon />
            </Button>

            <TextField
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "2rem",
                  fontWeight: 700,
                  width: "70px",
                  color: COLORS.text,
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
                backgroundColor: COLORS.green,
                "&:hover": { backgroundColor: COLORS.greenDark },
                borderRadius: 2,
              }}
            >
              <AddIcon />
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 2 }}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              sx={{
                flex: 1,
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 2,
                textTransform: "none",
                backgroundColor: "rgba(45,41,38,0.15)",
                color: COLORS.text,
                "&:hover": { backgroundColor: "rgba(45,41,38,0.22)" },
              }}
            >
              {orderItems.find((x) => x.name === product.name)
                ? "Remove From Order"
                : "Cancel"}
            </Button>

            <Button
              onClick={addToOrderhandler}
              variant="contained"
              sx={{
                flex: 1,
                fontWeight: 800,
                fontSize: "1.1rem",
                borderRadius: 2,
                backgroundColor: COLORS.green,
                "&:hover": { backgroundColor: COLORS.greenDark },
                textTransform: "none",
              }}
            >
              Add to Order
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ==============================
          LEFT SIDEBAR (WIDER + IMAGE BUTTONS)
      ============================== */}
      <Box
        sx={{
          width: 'SIDEBAR_WIDTH',
          height: "100vh",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          px: 2,   // 👈 adds space on left and right

          // ✅ green sidebar
          background: `linear-gradient(180deg, ${COLORS.green} 0%, ${COLORS.greenDark} 100%)`,
          borderRight: `2px solid rgba(255,248,231,0.25)`,
          boxShadow: "6px 0 18px rgba(0,0,0,0.12)",
          borderTopRightRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: COLORS.cream }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* (NO TEXT LOGO) — keep spacing clean */}
            <Box sx={{ height: 16 }} />

{categories.map((category) => {
  const isSelected = categoryName === category.name;

  const btnImg =
    getCategoryButtonImg(category.name) || category.image; // uses your mapped images first

  return (
    <ListItem
      key={category.name}
      disablePadding
      sx={{
        mb: .2,
        justifyContent: "center",
      }}
    >
<Box
  component="img"
  src={btnImg}
  alt={category.name}
  onClick={() => categoryClickHandler(category.name)}
  sx={{
    width: 400,
    height: 150,
    objectFit: "contain",
    cursor: "pointer",
    display: "block",
    userSelect: "none",

    transition: "transform 0.25s ease, opacity 0.25s ease",

    transform: isSelected ? "scale(1.08)" : "scale(1)",
    opacity: isSelected ? 1 : 0.55,   // 👈 faded when not selected

    "&:hover": {
      transform: "scale(1.04)",
      opacity: 1,
    },
  }}
/>

    </ListItem>
  );
})}

          </>
        )}
      </Box>

      {/* ==============================
          MAIN MENU
      ============================== */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 5,
          pb: 14,
          borderRadius: "30px 0 0 30px",
          backgroundColor: "rgba(255,248,231,0.70)",
          boxShadow: "inset 0 0 18px rgba(0,0,0,0.04)",

          // subtle scrollbar
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(48,65,35,0.25)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(48,65,35,0.40)",
          },
        }}
      >
        {/* HEADER + SORT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Spectral", serif',
              fontWeight: "bold",
              color: COLORS.green,
              textShadow: "0px 1px 5px rgba(0,0,0,0.12)",
              mt: 2.5,
              fontSize: "3.5rem",
            }}
          >
            {categoryName ? formatCategoryName(categoryName) : "FEATURED DISHES:"}
          </Typography>

          {categoryName && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: "#304123",
                border: `2px solid #304123`,
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                boxShadow: "0 6px 16px rgba(62, 78, 61, 0.47)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#ed7319",
                  boxShadow: "0 10px 24px #ed711934",
                },
              }}
              onClick={handleSortClick}
            >
              <SortIcon sx={{ color: COLORS.cream }} />
              <Typography sx={{fontWeight: 700, color: COLORS.cream}}>
                Sort:
              </Typography>
              <Typography
                sx={{
                  color: COLORS.orange,
                  fontWeight: 800,
                }}
              >
                {sortOrder === "default"
                  ? "Default"
                  : sortOrder === "lowToHigh"
                  ? "Lowest Price"
                  : "Highest Price"}
              </Typography>
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            open={openSortMenu}
            onClose={() => handleSortClose(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleSortClose("default")} selected={sortOrder === "default"}>
              Default
            </MenuItem>
            <MenuItem onClick={() => handleSortClose("lowToHigh")} selected={sortOrder === "lowToHigh"}>
              Price: Low to High
            </MenuItem>
            <MenuItem onClick={() => handleSortClose("highToLow")} selected={sortOrder === "highToLow"}>
              Price: High to Low
            </MenuItem>
          </Menu>
        </Box>

        {/* CONTENT */}
        {categoryName === "" ? (
          // Poster view
          <Box
            sx={{
              width: "100%",
              height: "calc(80vh - 90px)",
              backgroundImage: 'url("/images/MenuImg.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              mt: 4,
              borderRadius: "16px",
              boxShadow: "inset 0 0 45px #5aa81dad, 0 10px 30px rgba(0,0,0,0.12)",
              border: `3px solid #304123`,
            }}
          />
        ) : loadingProducts ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: COLORS.green }} />
          </Box>
        ) : errorProducts ? (
          <Alert severity="error">{errorProducts}</Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {[...products]
              .sort((a, b) => {
                if (sortOrder === "lowToHigh") return a.price - b.price;
                if (sortOrder === "highToLow") return b.price - a.price;
                return 0;
              })
              .map((p) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={p.name}>
                  <Card
                    sx={{
                      height: 285,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      mt: 4,
                      borderRadius: 4,
                      backgroundColor: COLORS.cream,
                      border: `15px solid #304123`,
                      boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                      transition: "0.25s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 16px 34px rgba(48,65,35,0.22)",
                      },
                    }}
                    onClick={() =>
                      productClickHandler({
                        ...p,
                        itemCategorySelected: categoryName,
                        itemId: p.id || p.itemId,
                      })
                    }
                  >
                    <CardActionArea sx={{ flexGrow: 1 }}>
                      <CardMedia
                        component="img"
                        alt={p.name}
                        image={p.image}
                        sx={{
                          height: 155,
                          width: "100%",
                          objectFit: "contain",
                          borderRadius: "18px 18px 0 0",
                        }}
                      />

                      <CardContent sx={{ textAlign: "center", py: 1.5 }}>
                        <Typography
                          gutterBottom
                          sx={{
                            fontWeight: 800,
                            color: COLORS.text,
                            fontSize: "1.1rem",
                            textShadow: "0px 1px 4px rgba(0,0,0,0.10)",
                          }}
                        >
                          {p.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Spectral", serif',
                            color: COLORS.orange,
                            fontWeight: 900,
                            fontSize: "1.8rem",
                            textShadow: "0px 1px 4px rgba(218,49,3,0.20)",
                          }}
                        >
                          ₱{p.price}
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
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#304123",
    boxShadow: "0 -3px 15px rgba(0,0,0,0.5)",
    borderRadius: "16px 16px 0 0",
    p: 2,
    width: "65%",
    maxWidth: 750,
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
      fontWeight: 700,
      width: "100%",
      textAlign: "center",
      mb: 1.5,
      backgroundColor: "#FFF8E7",
      color: "#2d2926",
      fontSize: "1.05rem",
    }}
  >
    My Order — {orderType} | Total: ₱{totalPrice} | Items: {itemsCount}
  </Box>

  <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
    <Button
      onClick={() => {
        clearOrder(dispatch);
        navigate("/");
      }}
      variant="contained"
      fullWidth
      sx={{
        borderRadius: 3,
        fontWeight: 700,
        backgroundColor: "#c3e2ab",
        color: "#2d2926",
        "&:hover": { backgroundColor: "#ed7319" },
        textTransform: "none",
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
        fontWeight: 700,
        backgroundColor: "#fff8e7",
        color: "#2d2926",
        "&:hover": { backgroundColor: "#ed7319" },
        textTransform: "none",
      }}
    >
      View Order
    </Button>
  </Box>
</Box>
    </Box>
  );
}
