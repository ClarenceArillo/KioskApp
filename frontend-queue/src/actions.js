// actions.js - USE PROXY VERSION
import axios from 'axios';
import {
  SCREEN_SET_WIDTH,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
} from './constants';

// ✅ USE RELATIVE URLS - React proxy will handle the CORS
const axiosInstance = axios.create({
  baseURL: "", // Empty base URL - let React proxy handle it
});

export const listQueue = async (dispatch) => {
  dispatch({ type: SCREEN_SET_WIDTH });
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    console.log('🔄 Fetching queue data using React proxy...');
    
    // ✅ USE RELATIVE PATH - React proxy will forward to http://localhost:7000
    const { data } = await axiosInstance.get(`/queue/display`);
    
    console.log('✅ Queue data received:', data);
    
    return dispatch({
      type: ORDER_QUEUE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('❌ Queue API Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to load queue data';
    return dispatch({
      type: ORDER_QUEUE_LIST_FAIL,
      payload: errorMessage,
    });
  }
};