import React, { useEffect, useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Logo from '../components/Logo';
import { useStyles } from '../styles';
import { setPaymentType } from '../actions';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    setPaymentType(dispatch, 'Cashless (QR Payment)');
  }, [dispatch]);

  const confirmHandler = () => {
    navigate('/receipt');
  };

  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Logo large />
        <Typography variant="h3" gutterBottom>
          Payment Method
        </Typography>
        <Typography variant="h5" gutterBottom>
          Cashless Payment
        </Typography>

        <Box
          className={styles.center}
          style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', marginTop: '20px' }}
        >
          <img
            src="/images/qrcode.png"
            alt="QR Code"
            style={{ width: '250px', height: '250px', objectFit: 'contain' }}
          />
        </Box>

        <Typography variant="h6" style={{ marginTop: '20px', color: '#fff' }}>
          Scan the QR code to pay
        </Typography>

        <Box className={`${styles.center} ${styles.space}`} style={{ marginTop: '40px' }}>
          <Button onClick={confirmHandler} variant="contained" color="primary" className={styles.largeButton}>
            Confirm Payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
