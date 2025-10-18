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
import React, { useContext, useEffect } from 'react';
import { listQueue } from '../actions';

export default function QueueScreen() {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);

  const { queue, loading, error } = state.queueList || {
    queue: {},
    loading: false,
    error: '',
  };

  useEffect(() => {
    listQueue(dispatch);
  }, [dispatch]);

  return (
    <Box className={styles.queueRoot}>
      {/* Header */}
      <Box className={styles.queueHeader}>
        <Typography variant="h3" className={styles.headerText}>
          CLAIM MONITOR
        </Typography>
      </Box>

      {/* Titles + Divider just under header */}
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
            item
            xs={5}
            className={styles.queueColumn}
            sx={{
              border: '1px solid #ffcdd2',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              backgroundColor: '#ffffff',
              padding: 3,
            }}
          >
            <Typography
              variant="h4"
              className={styles.queueTitle}
              sx={{ color: '#c62828', fontWeight: 700, marginBottom: 2 }}
            >
              PREPARING
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <List className={styles.queueList}>
                {queue.inProgressOrders?.length > 0 ? (
                  queue.inProgressOrders.map((order) => (
                    <ListItem
                      key={order.number}
                      className={styles.queueItem}
                      sx={{
                        border: '1px solid #ef9a9a',
                        borderRadius: '8px',
                        marginBottom: 1,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {order.number}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="h6" color="textSecondary">
                    No orders yet
                  </Typography>
                )}
              </List>
            )}
          </Grid>

          {/* Divider */}
          <Grid item xs="auto" className={styles.dividerContainer}>
            <Divider
              orientation="vertical"
              flexItem
              className={styles.verticalDivider}
              sx={{ borderColor: '#ddd' }}
            />
          </Grid>

          {/* RIGHT COLUMN: NOW SERVING */}
          <Grid
            item
            xs={5}
            className={styles.queueColumn}
            sx={{
              border: '1px solid #c8e6c9',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              backgroundColor: '#ffffff',
              padding: 3,
            }}
          >
            <Typography
              variant="h4"
              className={styles.queueTitle}
              sx={{ color: '#2e7d32', fontWeight: 700, marginBottom: 2 }}
            >
              NOW SERVING
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <List className={styles.queueList}>
                {queue.servingOrders?.length > 0 ? (
                  queue.servingOrders.map((order) => (
                    <ListItem
                      key={order.number}
                      className={styles.queueItem}
                      sx={{
                        border: '1px solid #a5d6a7',
                        borderRadius: '8px',
                        marginBottom: 1,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {order.number}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="h6" color="textSecondary">
                    No orders yet
                  </Typography>
                )}
              </List>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
