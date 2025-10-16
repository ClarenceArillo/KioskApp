import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Logo from '../components/Logo';
import { useStyles } from '../styles';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function OrderCompleteScreen() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { order } = state;

  // Removed createOrder() call so it won’t depend on backend
  useEffect(() => {
    // intentionally left empty
  }, []);

  return (
    <Box className={styles.root}>
      <Box className={`${styles.main} ${styles.red} ${styles.center}`}>
        <Box>
          <Logo large />
          <>
            <Typography
              gutterBottom
              className={styles.title}
              variant="h3"
              component="h3"
            >
              Your order has been placed
            </Typography>
            <Typography
              gutterBottom
              className={styles.title}
              variant="h1"
              component="h1"
            >
              Thank you!
            </Typography>
          </>
        </Box>
      </Box>

      <Box className={`${styles.center} ${styles.space}`}>
        <Button
          onClick={() => navigate('/')}
          variant="contained"
          color="primary"
          className={styles.largeButton}
        >
          Order Again
        </Button>
      </Box>
    </Box>
  );
}
