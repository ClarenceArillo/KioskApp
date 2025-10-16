import axios from "axios";
import {
  ORDER_SET_TYPE,
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
export const startOrder = async () => {
  try {
    const response = await axiosInstance.post("/start");
    console.log("Order started:", response.data);
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

    const withImages = data.map((product) => {
      const possibleImages = normalizeImagePath(
        categoryName.toUpperCase(),
        product.itemName
      );

      console.log(`Product: ${product.itemName}`, {
        possibleImages,
        selected: possibleImages[0]
      });

      // First valid possible path or fallback
      return {
        ...product,
        image: possibleImages[0] || "/images/default.png",
      };
    });

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
export const addToOrder = (dispatch, item) => {
  dispatch({ type: ORDER_ADD_ITEM, payload: item });
};

export const removeFromOrder = (dispatch, item) => {
  dispatch({ type: ORDER_REMOVE_ITEM, payload: item });
};

export const clearOrder = (dispatch) => {
  dispatch({ type: ORDER_CLEAR });
};
