import axios from "axios";
import {
  ORDER_SET_TYPE,
  ORDER_SET_PAYMENT_TYPE,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
} from "./constants";

// ✅ Backend base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:7000/order",
});

// ✅ Start order
export const startOrder = (dispatch) => async () => {
  try {
    const response = await axiosInstance.post("/start");
    console.log("Order started:", response.data);

    // Clear frontend cart state
    dispatch({ type: ORDER_CLEAR });

    return response.data;
  } catch (error) {
    console.error("Failed to start order:", error.message);
    throw error;
  }
};


// ✅ Set order type
export const setOrderType = (dispatch, orderType) => {
  dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};

// ✅ Category representative images
const categoryImageMap = {
  ALMUSAL:    "/images/ALMUSAL/Tapsilog.PNG",
  FAMILY_MEAL: "images/FAMILYMEAL/FiestaMeal.PNG",
  MERYENDA:   "/images/MERYENDA/Pancitpalabok.png",
  PANGHIMAGAS:"/images/PANGHIMAGAS/Lecheflan.png",
  RICE_MEAL:   "images/RICEMEAL/Porkbbq.png",
  WHATS_NEW:   "/images/WHATSNEW/Champorado_puto.PNG",
};

// ✅ Get categories
export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const { data } = await axiosInstance.get("/categories");
    const mapped = data.map((category) => ({
      name: category,
      image: categoryImageMap[category.toUpperCase()] || "/images/default.png",
    }));
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: mapped });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message || "Failed to fetch categories",
    });
  }
};

// ✅ Normalize filename for better matching
const normalizeImagePath = (category, itemName) => {
  const baseName = itemName
    .replaceAll("&", "and")
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(".", "")
    .replaceAll("/", "")
    .trim();

  const variations = [
    baseName,
    baseName.toLowerCase(),
    baseName.toUpperCase(),
    baseName.charAt(0).toUpperCase() + baseName.slice(1).toLowerCase(),
  ];

  const extensions = [".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".JPEG"];

  const candidates = [];
  variations.forEach((name) => {
    extensions.forEach((ext) => {
      candidates.push(`/images/${category.toUpperCase()}/${name}${ext}`);
    });
  });

  console.log(`Looking for ${itemName} in:`, candidates);
  return candidates;
};

// ✅ Get menu products per category
export const listProducts = async (dispatch, categoryName = "WHATS_NEW") => {
  dispatch({ type: PRODUCT_LIST_REQUEST });

  try {
    const { data } = await axiosInstance.get(`/${categoryName}/menu`, {
      params: { sortOrder: "default" },
    });

    console.log("Fetched products:", data); // 👀 confirm we got items

    const withImages = data.map((product) => {
      const possibleImages = normalizeImagePath(
        categoryName.toUpperCase(),
        product.itemName
      );

      // ✅ Merge backend data into the structure React expects
      return {
        id: product.itemId,
        name: product.itemName,
        price: product.itemPrice,
        description: product.itemDescription,
        image:
          product.itemImageUrl?.startsWith("http")
            ? product.itemImageUrl
            : `/${product.itemImageUrl.replace(/^\/?/, "")}`, // ensure leading slash for local images
        size: product.itemSize,
        category: product.itemCategorySelected,
      };
    });

    console.log("Mapped products:", withImages); // 👀 verify correct shape

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: withImages });
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message || "Failed to fetch menu",
    });
  }
};

// ✅ Order actions
export const addToOrder = async (dispatch, product) => {
    try {
      // Normalize data into backend MenuItem structure
      const payload = {
        itemId: product.id || product.itemId,
        itemName: product.name || product.itemName,
        itemPrice: product.price || product.itemPrice,
        itemQuantity: product.quantity || product.itemQuantity || 1,
        itemSize: product.size || product.itemSize || "M",
        itemCategorySelected:
          product.category ||
          product.itemCategorySelected ||
          "WHATS_NEW",
        itemImageUrl:
          product.image ||
          product.itemImageUrl ||
          "",
      };

      // Build endpoint with dynamic category + itemId
      const category = encodeURIComponent(payload.itemCategorySelected);
      const itemId = payload.itemId;

      const res = await fetch(
        `http://localhost:7000/order/${category}/${itemId}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add item to backend cart");
      }

      const updatedCart = await res.json();

      // Update frontend store only after backend confirms success
      dispatch({
        type: "ORDER_ADD_ITEM",
        payload: {
          id: payload.itemId,
          itemId: payload.itemId,
          name: payload.itemName,
          price: payload.itemPrice,
          quantity: payload.itemQuantity,
          size: payload.itemSize,
          image: payload.itemImageUrl,
          category: payload.itemCategorySelected,
        },
      });

      console.log(`✅ Item added successfully: ${payload.itemName}`);
      console.log("🛒 Updated cart:", updatedCart);
    } catch (error) {
      console.error("❌ addToOrder failed:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };



export const removeFromOrder = (dispatch, item) => {
  dispatch({ type: ORDER_REMOVE_ITEM, payload: item });
};

export const clearOrder = (dispatch) => {
  dispatch({ type: ORDER_CLEAR });
};

export const setPaymentType = (dispatch, paymentType) => {
  dispatch({
    type: ORDER_SET_PAYMENT_TYPE,
    payload: paymentType,
  });
};

