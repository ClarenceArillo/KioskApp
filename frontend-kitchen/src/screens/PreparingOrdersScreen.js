// src/screens/PreparingOrdersScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Divider, Paper, Typography, CircularProgress } from '@mui/material';
import { useStyles } from '../styles';
import { Store } from '../Store';
import KitchenApiService from '../services/kitchenApi';

export default function PreparingOrdersScreen() {
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders on component mount
  useEffect(() => {
    loadOrders(true);
    const cleanupSSE = KitchenApiService.setupOrderStream(
      () => loadOrders(false),
      () => loadOrders(false)
    );

    const interval = setInterval(() => {
      loadOrders();
    }, 5000); // Refresh every 5 seconds

    return () => {
      clearInterval(interval);
      cleanupSSE();
    };
    }, []);

  const loadOrders = async (isInitialState = false) => {
    try {
      if(isInitialState){
       setLoading(true); 
      }else{
        setRefreshing(true);
      }
      
      const pendingOrders = await KitchenApiService.getOrdersByStatus('PENDING');
      const preparingOrders = await KitchenApiService.getOrdersByStatus('PREPARING');
      const servingOrders = await KitchenApiService.getOrdersByStatus('NOW_SERVING');
      
      // Combine and sort by order number (FIFO)
      const allOrders = [...pendingOrders, ...preparingOrders, ...servingOrders]
        .sort((a, b) => a.number - b.number);

      console.log('📦 Loaded orders:', allOrders);
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      alert('Cannot connect to kitchen backend. Please ensure the Spring Boot server is running on port 7000.');
    } finally {
      if(isInitialState){
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const handleStart = async (order) => {
    try {
      // Check FIFO restriction
      const canStart = canStartOrder(order);
      if (!canStart) {
        alert('You must finish previous orders first (Follow FIFO rule).');
        return;
      }

      await KitchenApiService.updateOrderStatus(order.number, 'PREPARING');
      await loadOrders(); // Refresh orders
      setSelectedOrder({ ...order, state: 'PREPARING' });
    } catch (error) {
      console.error('Failed to start order:', error);
      alert('Failed to start order. Please try again.');
    }
  };

  const handleReady = async (order) => {
    try {
      await KitchenApiService.updateOrderStatus(order.number, 'NOW_SERVING');
      await loadOrders();
      setSelectedOrder({ ...order, state: 'NOW_SERVING' });
    } catch (error) {
      console.error('Failed to mark order as ready:', error);
      alert('Failed to update order status.');
    }
  };

  const handleDone = async (order) => {
    try {
      await KitchenApiService.updateOrderStatus(order.number, 'DONE');
      await loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to complete order:', error);
      alert('Failed to complete order.');
    }
  };

  const canStartOrder = (order) => {
    if (order.state !== 'PENDING') return false;
    
    // FIFO: Only allow starting the oldest pending order
    const pendingOrders = orders
      .filter(o => o.state === 'PENDING')
      .sort((a, b) => a.number - b.number);
    
    return pendingOrders.length > 0 && pendingOrders[0].number === order.number;
  };

  if (loading) {
    return (
      <Box className={styles.orderRoot}>
        <Box className={styles.orderHeaderRed}>PREPARING</Box>
        <Box className={styles.center} sx={{ padding: 4 }}>
          <CircularProgress />
          <Typography>Loading orders...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.orderRoot}>
      <Box className={styles.orderHeaderRed}>PREPARING</Box>

      <Box className={styles.orderMain}>
        {/* LEFT SIDE: LIST OF ORDERS */}
        <Box className={styles.orderList}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            LIST OF ORDERS (FIFO)
          </Typography>

          {orders.map((order) => (
            <Box
              key={order._id}
              className={styles.orderListItem}
              style={{
                backgroundColor:
                  order.state === 'PREPARING'
                    ? '#ffcdd2'
                    : order.state === 'NOW_SERVING'
                    ? '#ffe082'
                    : order.state === 'DONE'
                    ? '#c8e6c9'
                    : '#fff',
                border: '1px solid #f8bbd0',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                marginBottom: '8px',
                padding: '8px 12px',
              }}
              onClick={() => setSelectedOrder(order)}
            >
              <Typography>Order #{order.number}</Typography>

              {order.state === 'PENDING' && canStartOrder(order) ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: 'limegreen', color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStart(order);
                  }}
                >
                  START
                </Button>
              ) : order.state === 'PENDING' ? (
                <Button variant="contained" size="small" disabled>
                  WAIT
                </Button>
              ) : (
                <Button variant="contained" size="small" disabled>
                  {order.state}
                </Button>
              )}
            </Box>
          ))}
        </Box>

        {/* DIVIDER */}
        <Divider orientation="vertical" flexItem className={styles.orderDividerRed} />

        {/* RIGHT SIDE: ORDER DETAILS */}
        <Box className={styles.orderDetailsRed}>
          {selectedOrder ? (
            <>
              <Paper className={styles.orderHeaderBoxRed}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ORDER NO. {selectedOrder.number}
                </Typography>
                <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                  {selectedOrder.orderType} | DATE: {selectedOrder.date}
                </Typography>
              </Paper>

              {selectedOrder.orderItems?.map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    marginBottom: 1,
                    borderBottom: '1px dashed #ffcdd2',
                    paddingBottom: 0.5,
                  }}
                >
                  {item.quantity}x {item.name} ({item.size}) - ₱{item.price}
                </Typography>
              ))}

              {['PREPARING', 'NOW_SERVING'].includes(selectedOrder.state) && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: selectedOrder.state === 'NOW_SERVING' ? '#9e9e9e' : '#ff2040',
                      color: 'white',
                    }}
                    disabled={selectedOrder.state === 'NOW_SERVING'}
                    onClick={() => handleReady(selectedOrder)}
                  >
                    READY
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: selectedOrder.state === 'NOW_SERVING' ? '#ff2040' : '#9e9e9e',
                      color: 'white',
                    }}
                    disabled={selectedOrder.state !== 'NOW_SERVING'}
                    onClick={() => handleDone(selectedOrder)}
                  >
                    DONE
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Typography align="center" sx={{ color: '#aaa' }}>
              Select an order to view details
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}