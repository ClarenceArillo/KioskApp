import React, { useState } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useStyles } from '../styles';

export default function DoneOrdersScreen() {
  const styles = useStyles();

  const [orders] = useState([
    {
      _id: 10,
      number: 1080,
      state: 'DONE',
      orderType: 'DINE IN',
      date: '10/17/2025',
      orderItems: [
        { name: 'ADOBO', quantity: 1 },
        { name: 'ICE TEA', quantity: 2 },
      ],
    },
    {
      _id: 11,
      number: 1081,
      state: 'DONE',
      orderType: 'TAKE OUT',
      date: '10/17/2025',
      orderItems: [
        { name: 'SISIG', quantity: 1 },
        { name: 'RICE', quantity: 1 },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <Box className={styles.orderRoot}>
      {/* 🟢 DONE HEADER */}
      <Box className={styles.orderHeaderGreen}>DONE</Box>

      <Box className={styles.orderMain}>
        {/* LEFT SIDE: LIST OF ORDERS */}
        <Box className={styles.orderList}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            LIST OF ORDERS
          </Typography>

          {orders
            .sort((a, b) => b.number - a.number)
            .map((order) => (
              <Box key={order._id} className={styles.orderListItem}>
                <Typography>{order.number}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: 'green', color: 'white' }}
                  onClick={() => setSelectedOrder(order)}
                >
                  VIEW
                </Button>
              </Box>
            ))}
        </Box>

        {/* VERTICAL DIVIDER */}
        <Divider
          orientation="vertical"
          flexItem
          className={styles.orderDividerGreen}
        />

        {/* RIGHT SIDE: ORDER DETAILS */}
        <Box
          className={styles.orderDetailsGreen}
          sx={{
            border: '1px solid #c8e6c9', // light green border
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
                className={styles.orderHeaderBoxGreen}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  border: '1px solid #a5d6a7',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ORDER NO. {selectedOrder.number}
                </Typography>
                <Typography variant="body2" sx={{ color: '#388e3c' }}>
                  {selectedOrder.orderType} | DATE: {selectedOrder.date}
                </Typography>
              </Paper>

              {/* Order items list */}
              {selectedOrder.orderItems.map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    marginBottom: 1,
                    borderBottom: '1px dashed #c8e6c9',
                    paddingBottom: 0.5,
                  }}
                >
                  {item.quantity}x {item.name}
                </Typography>
              ))}

              {/* CLOSE BUTTON */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'green',
                    color: 'white',
                    '&:hover': { bgcolor: '#388e3c' },
                  }}
                  onClick={() => setSelectedOrder(null)}
                >
                  CLOSE
                </Button>
              </Box>
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
