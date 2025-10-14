import axios from "axios";
import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  ORDER_SET_TYPE,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "./constants";

// ✅ Use single axios instance for all backend requests
const axiosInstance = axios.create({
  baseURL: "http://localhost:7000/order",
});

// ✅ Start Order
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

// ✅ Set Order Type (DINE_IN / TAKE_OUT)
export const setOrderType = (dispatch, orderType) => {
  return dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};

// ✅ Get Menu Categories
export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const { data } = await axiosInstance.get("/categories");
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message || "Failed to fetch categories",
    });
  }
};

// ✅ Get Menu Items per Category
export const listProducts = async (dispatch, categoryName = "WHATs_NEW") => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await axiosInstance.get(`/${categoryName}/menu`);
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message || "Failed to fetch menu items",
    });
  }
};
