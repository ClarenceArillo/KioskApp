import React, { createContext, useReducer } from 'react';
import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  ORDER_ADD_ITEM,
  ORDER_CLEAR,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_REMOVE_ITEM,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_SET_TYPE,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
} from './constants';

export const Store = createContext();

const initialState = {
  widthScreen: false,
  categoryList: { loading: true },
  productList: { loading: true },
  queueList: { loading: true },
  order: {
    orderType: 'Eat in',
    orderItems: [],
    paymentType: 'Cashless Pay here',
  },
  orderCreate: { loading: true },
  orderList: { loading: true },
};

function reducer(state, action) {
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };

    case CATEGORY_LIST_REQUEST:
      return { ...state, categoryList: { loading: true } };
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: { loading: false, categories: action.payload },
      };
    case CATEGORY_LIST_FAIL:
      return {
        ...state,
        categoryList: { loading: false, error: action.payload },
      };

    case PRODUCT_LIST_REQUEST:
      return { ...state, productList: { loading: true } };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        productList: { loading: false, products: action.payload },
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...state,
        productList: { loading: false, error: action.payload },
      };

    case ORDER_SET_TYPE:
      return {
        ...state,
        order: { ...state.order, orderType: action.payload },
      };

    case ORDER_SET_PAYMENT_TYPE:
      return {
        ...state,
        order: { ...state.order, paymentType: action.payload },
      };

    case "ORDER_ADD_ITEM": {
      const data = action.payload;

      // ✅ if backend sends array of items
      if (Array.isArray(data)) {
        const normalizedItems = data.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          price: Number(item.itemPrice || item.price) || 0,
          quantity: Number(item.itemQuantity || item.quantity) || 1,
          size: item.itemSize || "R",
          subtotal:
            (Number(item.itemPrice || item.price) || 0) *
            (Number(item.itemQuantity || item.quantity) || 1),
          category: item.itemCategorySelected || item.category,
          imageUrl: item.itemImageUrl || item.image || null,
        }));

        const itemsCount = normalizedItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        const totalPrice = normalizedItems.reduce(
          (acc, item) => acc + item.subtotal,
          0
        );

        return {
          ...state,
          order: {
            ...state.order,
            orderItems: normalizedItems,
            itemsCount,
            totalPrice,
          },
        };
      }

      // ✅ if payload is a single object (most current backend setups)
      const newItem = {
        itemId: data.itemId,
        name: data.name || data.itemName,
        price: Number(data.price || data.itemPrice) || 0,
        quantity: Number(data.quantity || data.itemQuantity) || 1,
        size: data.size || "R",
        category: data.category || data.itemCategorySelected,
        image: data.image || data.itemImageUrl || null,
      };

      const existing = state.order.orderItems.find(
        (x) => x.itemId === newItem.itemId
      );

      const updatedItems = existing
        ? state.order.orderItems.map((x) =>
            x.itemId === existing.itemId
              ? { ...x, quantity: x.quantity + newItem.quantity }
              : x
          )
        : [...state.order.orderItems, newItem];

      const itemsCount = updatedItems.reduce((a, c) => a + c.quantity, 0);
      const totalPrice = updatedItems.reduce((a, c) => a + c.quantity * c.price, 0);

      return {
        ...state,
        order: {
          ...state.order,
          orderItems: updatedItems,
          itemsCount,
          totalPrice,
        },
      };
    }

    case ORDER_REMOVE_ITEM: {
      const orderItems = state.order.orderItems.filter(
        (x) => x.name !== action.payload.name
      );
      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );

      const totalPrice = Math.round(itemsPrice * 100) / 100;

      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          totalPrice,
          itemsCount,
        },
      };
    }

    case ORDER_CLEAR:
      return {
        ...state,
        order: {
          orderItems: [],
          totalPrice: 0,
          itemsCount: 0,
        },
      };

    case ORDER_CREATE_REQUEST:
      return { ...state, orderCreate: { loading: true } };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreate: { loading: false, newOrder: action.payload },
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreate: { loading: false, error: action.payload },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
