import React, { createContext, useReducer } from 'react';
import {
  ORDER_QUEUE_LIST_FAIL,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
} from './constants';

export const Store = createContext();

const initialState = {
  queueList: { 
    loading: true, 
    queue: {
      preparingOrders: [],
      servingOrders: [],
      totalPreparing: 0,
      totalServing: 0,
      lastUpdated: null,
      success: false
    }, 
    error: null 
  },
};

function reducer(state, action) {
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };

    case ORDER_QUEUE_LIST_REQUEST:
      return { 
        ...state, 
        queueList: { 
          loading: true,
          queue: state.queueList.queue, // Keep existing queue data while loading
          error: null 
        } 
      };
      
    case ORDER_QUEUE_LIST_SUCCESS:
      return {
        ...state,
        queueList: { 
          loading: false, 
          queue: action.payload,
          error: null 
        },
      };
      
    case ORDER_QUEUE_LIST_FAIL:
      return {
        ...state,
        queueList: { 
          loading: false, 
          error: action.payload,
          queue: state.queueList.queue // Keep existing queue data on error
        },
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