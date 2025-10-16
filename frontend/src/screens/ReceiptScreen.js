import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useStyles } from '../styles';
import Logo from '../components/Logo';

export default function ReceiptScreen(props) {
  const styles = useStyles();

  return (
    <Box className={`${styles.root} ${styles.navy}`}>
      <Box className={`${styles.main} ${styles.center}`}>
        <Logo large />

        <Typography variant="h3" gutterBottom>
          Receipt Printing
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please wait while your receipt is being printed...
        </Typography>

        <Box
          className={styles.center}
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '30px',
          }}
        >
          <img
            src="/images/receipt.png" // receipt placeholder
            alt="Receipt"
            style={{
              width: '200px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Typography
          variant="h5"
          style={{
            marginTop: '30px',
            color: '#fff',
          }}
        >
          Pick up your order at the counter
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className={styles.largeButton}
          style={{ marginTop: '30px' }}
          onClick={() => props.history.push('/')}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
}
