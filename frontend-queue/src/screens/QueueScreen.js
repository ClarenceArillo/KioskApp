// src/screens/QueueScreen.js - FIXED
import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { Store } from '../Store';
import { useStyles } from '../styles';
import React, { useContext, useEffect, useState } from 'react';
import { listQueue } from '../actions';

export default function QueueScreen() {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Safe destructuring with default values
  const { queue = {}, loading = false, refreshing = false, error = '' } = state.queueList || {};

  // Safe data extraction with fallbacks
  const preparingOrders = queue?.preparingOrders || [];
  const servingOrders = queue?.servingOrders || [];

  useEffect(() => {
    console.log('🔄 Loading queue data...');
    listQueue(dispatch, true); // Pass initialState flag
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        console.log('🔄 Auto-refreshing queue data...');
        listQueue(dispatch,false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, autoRefresh]);

  console.log('📊 Current queue state:', { preparingOrders, servingOrders, loading, error });

  return (
    <Box className={styles.queueRoot}>
      {/* Header */}
      <Box className={styles.queueHeader}>
        <Typography variant="h3" className={styles.headerText}>
          CLAIM MONITOR
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
          Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
        </Typography>
      </Box>

      {/* Queue Content */}
      <Box className={styles.queueContent}>
        <Grid
          container
          justifyContent="center"
          alignItems="flex-start"
          spacing={6}
          className={styles.queueGrid}
        >
          {/* LEFT COLUMN: PREPARING */}
          <Grid
            className={styles.queueColumn}
            sx={{
              border: '2px solid #ffcdd2',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              backgroundColor: '#fffafafa',
              padding: 3,
              minHeight: '400px',
              width: '45%' // Use width instead of xs
            }}
          >
            <Typography
              variant="h4"
              className={styles.queueTitle}
              sx={{ 
                color: '#c62828', 
                fontWeight: 700, 
                marginBottom: 2,
                textAlign: 'center'
              }}
            >
              PREPARING ({preparingOrders.length})
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#c62828' }} />
                <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
                <br />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Make sure the backend is running on port 7000
                </Typography>
              </Alert>
            ) : (
              <List className={styles.queueList} sx={{ minHeight: '300px' }}>
                {preparingOrders.length > 0 ? (
                  preparingOrders.map((order) => (
                    <ListItem
                      key={order?.number || order?.orderId || Math.random()}
                      className={styles.queueItem}
                      sx={{
                        border: '2px solid #ef9a9a',
                        borderRadius: '8px',
                        marginBottom: 2,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        backgroundColor: '#ffebee',
                        padding: 2,
                        textAlign: 'center',
                        '&:hover': {
                          backgroundColor: '#ffcdd2',
                          transform: 'scale(1.02)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#c62828',
                          width: '100%'
                        }}
                      >
                        Order #{order?.number || order?.orderId || 'N/A'}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 4,
                    padding: 3
                  }}>
                    <Typography 
                      variant="h6" 
                      color="textSecondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      No orders preparing
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Grid>

          {/* Divider */}
          <Grid className={styles.dividerContainer}>
            <Divider
              orientation="vertical"
              flexItem
              className={styles.verticalDivider}
              sx={{ 
                borderColor: '#ddd',
                borderWidth: '2px',
                height: '80%',
                marginTop: 4
              }}
            />
          </Grid>

          {/* RIGHT COLUMN: NOW SERVING */}
          <Grid
            className={styles.queueColumn}
            sx={{
              border: '2px solid #c8e6c9',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              backgroundColor: '#f8fff8',
              padding: 3,
              minHeight: '400px',
              width: '45%' // Use width instead of xs
            }}
          >
            <Typography
              variant="h4"
              className={styles.queueTitle}
              sx={{ 
                color: '#2e7d32', 
                fontWeight: 700, 
                marginBottom: 2,
                textAlign: 'center'
              }}
            >
              NOW SERVING ({servingOrders.length})
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#2e7d32' }} />
                <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error}
                <br />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Make sure the backend is running on port 7000
                </Typography>
              </Alert>
            ) : (
              <List className={styles.queueList} sx={{ minHeight: '300px' }}>
                {servingOrders.length > 0 ? (
                  servingOrders.map((order) => (
                    <ListItem
                      key={order?.number || order?.orderId || Math.random()}
                      className={styles.queueItem}
                      sx={{
                        border: '2px solid #a5d6a7',
                        borderRadius: '8px',
                        marginBottom: 2,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        backgroundColor: '#e8f5e8',
                        padding: 2,
                        textAlign: 'center',
                        '&:hover': {
                          backgroundColor: '#c8e6c9',
                          transform: 'scale(1.02)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#2e7d32',
                          width: '100%'
                        }}
                      >
                        Order #{order?.number || order?.orderId || 'N/A'}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 4,
                    padding: 3
                  }}>
                    <Typography 
                      variant="h6" 
                      color="textSecondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      No orders serving
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}