import React, { useState } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useStyles } from '../styles';

export default function PreparingOrdersScreen() {
  const styles = useStyles();

  const [orders, setOrders] = useState([
    {
      _id: 1,
      number: 1083,
      state: 'PREPARING',
      orderType: 'DINE IN',
      date: '10/18/2025',
      orderItems: [
        { name: 'SINIGANG NA BABOY W RICE', quantity: 1 },
        { name: 'HALO-HALONG GALIT', quantity: 2 },
        { name: 'LECHE KA', quantity: 4 },
      ],
    },
    { _id: 2, number: 1084, state: 'TO_PREPARE' },
    { _id: 3, number: 1085, state: 'TO_PREPARE' },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(orders[0]);

  const handleStart = (order) => {
    const index = orders.findIndex((o) => o._id === order._id);
    const previousOrders = orders.slice(0, index);
    const unfinishedBefore = previousOrders.find(
      (o) => o.state !== 'DONE' && o.state !== 'NOW_SERVING'
    );

    if (unfinishedBefore) {
      alert('You must finish the previous order first (click READY).');
      return;
    }

    const updated = orders.map((o) =>
      o._id === order._id ? { ...o, state: 'PREPARING' } : o
    );
    setOrders(updated);
    setSelectedOrder({ ...order, state: 'PREPARING' });
  };

  const handleReady = (order) => {
    const updated = orders.map((o) =>
      o._id === order._id ? { ...o, state: 'NOW_SERVING' } : o
    );
    setOrders(updated);
    setSelectedOrder({ ...order, state: 'NOW_SERVING' });
  };

  const handleDone = (order) => {
    const updated = orders.map((o) =>
      o._id === order._id ? { ...o, state: 'DONE' } : o
    );
    setOrders(updated);
    setSelectedOrder({ ...order, state: 'DONE' });
  };

  const canStartOrder = (order) => {
    if (order.state !== 'TO_PREPARE') return false;
    const index = orders.findIndex((o) => o._id === order._id);
    if (index === 0) return true;
    const prevOrder = orders[index - 1];
    return prevOrder.state === 'NOW_SERVING' || prevOrder.state === 'DONE';
  };

  return (
    <Box className={styles.orderRoot}>
      <Box className={styles.orderHeaderRed}>PREPARING</Box>

      <Box className={styles.orderMain}>
        {/* LEFT SIDE: LIST OF ORDERS */}
        <Box
          className={styles.orderList}
          sx={{
            border: '1px solid #ffcdd2',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: 2,
            margin: 2,
            backgroundColor: '#ffffff',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            LIST OF ORDERS
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
              <Typography>{order.number}</Typography>

              {order.state === 'TO_PREPARE' && canStartOrder(order) ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: 'limegreen', color: 'white' }}
                  onClick={() => handleStart(order)}
                >
                  START
                </Button>
              ) : order.state === 'TO_PREPARE' ? (
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
        <Box
          className={styles.orderDetailsRed}
          sx={{
            border: '1px solid #ffcdd2',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: 3,
            margin: 2,
            backgroundColor: '#ffffff',
          }}
        >
          {selectedOrder ? (
            <>
              <Paper
                className={styles.orderHeaderBoxRed}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  border: '1px solid #ef9a9a',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ORDER NO. {selectedOrder.number}
                </Typography>
                <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                  {selectedOrder.orderType || ''} | DATE:{' '}
                  {selectedOrder.date || ''}
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
                  {item.quantity}x {item.name}
                </Typography>
              ))}

              {['PREPARING', 'NOW_SERVING'].includes(selectedOrder.state) && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor:
                        selectedOrder.state === 'NOW_SERVING'
                          ? '#9e9e9e'
                          : '#ff2040',
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
                      bgcolor:
                        selectedOrder.state === 'NOW_SERVING'
                          ? '#ff2040'
                          : '#9e9e9e',
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
