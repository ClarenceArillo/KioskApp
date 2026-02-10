// src/screens/DoneOrdersScreen.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Paper, Typography, CircularProgress } from '@mui/material';
import { useStyles } from '../styles';
import KitchenApiService from '../services/kitchenApi';

export default function DoneOrdersScreen() {
  const styles = useStyles();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDoneOrders(true);
      
    const interval = setInterval(() => {
      loadDoneOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []); 

  const loadDoneOrders = async (initialState = false) => {
    try {
      if(initialState){
      setLoading(true);
      // FIXED: Use getDoneOrders() instead of getOrdersByStatus('DONE')
      }else{
      setRefreshing(true);
      }
      const doneOrders = await KitchenApiService.getDoneOrders();
      setOrders(doneOrders);
    } catch (error) {
      console.error('Failed to load done orders:', error);
    } finally {
      if (initialState) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  if (loading) {
    return (
      <Box className={styles.orderRoot}>
        <Box className={styles.orderHeaderGreen}>DONE</Box>
        <Box className={styles.center} sx={{ padding: 4 }}>
          <CircularProgress />
          <Typography>Loading completed orders...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.orderRoot}>
      <Box className={styles.orderHeaderGreen}>DONE</Box>

      <Box className={styles.orderMain}>
        {/* LEFT SIDE: LIST OF ORDERS */}
        <Box className={styles.orderList}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            COMPLETED ORDERS 
          </Typography>

          {orders.length === 0 ? (
            <Typography sx={{ 
              color: '#666', 
              fontStyle: 'italic', 
              textAlign: 'center', 
              mt: 4,
              padding: 2
            }}>
              No completed orders yet
            </Typography>
          ) : (
            orders.map((order) => (
              <Box 
                key={order._id} 
                className={styles.orderListItem}
                sx={{
                  backgroundColor: selectedOrder?._id === order._id ? '#e8f5e8' : 'transparent',
                  border: selectedOrder?._id === order._id ? '2px solid #4caf50' : '1px solid #ddd',
                  transition: 'all 0.2s ease'
                }}
              >
                <Typography sx={{ fontWeight: 'medium' }}>Order #{order.number}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ 
                    bgcolor: 'green', 
                    color: 'white',
                    '&:hover': { bgcolor: '#2e7d32' }
                  }}
                  onClick={() => setSelectedOrder(order)}
                >
                  VIEW
                </Button>
              </Box>
            ))
          )}
        </Box>

        {/* VERTICAL DIVIDER */}
        <Divider orientation="vertical" flexItem className={styles.orderDividerGreen} />

        {/* RIGHT SIDE: ORDER DETAILS */}
        <Box className={styles.orderDetailsGreen}>
          {selectedOrder ? (
            <>
              <Paper className={styles.orderHeaderBoxGreen}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                  ORDER NO. {selectedOrder.number}
                </Typography>
                <Typography variant="body2" sx={{ color: '#388e3c', mt: 1 }}>
                  {selectedOrder.orderType} • {selectedOrder.date}
                </Typography>
              </Paper>

              <Box sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                  selectedOrder.orderItems.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 1.5,
                        borderBottom: '1px dashed #c8e6c9',
                        paddingBottom: 1,
                        paddingX: 1
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {item.quantity}x {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                          Size: {item.size}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: '#666', textAlign: 'center', mt: 2 }}>
                    No items in this order
                  </Typography>
                )}
              </Box>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <Box sx={{ 
                  borderTop: '2px solid #4caf50', 
                  mt: 2, 
                  pt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                    ₱{selectedOrder.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    px: 3,
                    '&:hover': { bgcolor: '#388e3c' },
                  }}
                  onClick={() => setSelectedOrder(null)}
                >
                  CLOSE
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {orders.length === 0 ? 'No Orders Completed' : 'Order Details'}
              </Typography>
              <Typography variant="body2" align="center">
                {orders.length === 0 
                  ? 'Completed orders will appear here' 
                  : 'Select an order from the list to view details'
                }
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}