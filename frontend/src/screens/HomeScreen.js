import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomeScreen() {
  const styles = useStyles();
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const response = await axios.post('http://localhost:7000/order/start');
      console.log('Order started:', response.data);
      navigate('/choose');
    } catch (error) {
      console.error('Failed to start order:', error);
      alert('Unable to start order. Please try again.');
    }
  };

  return (
    <Card
      className={styles.cardFull}
      style={{
        backgroundColor: '#ff193d',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={handleStart} style={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            height: '85%',
            fontWeight: 'bold',
          }}
        >
          <Typography
            component="h6"
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Fast & Easy
          </Typography>

          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: '6rem',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              textShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            Order <br /> & Pay <br /> Here
          </Typography>

          <TouchAppIcon
            sx={{
              mt: 3,
              fontSize: 40,
              color: 'white',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            backgroundColor: '#00b020',
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            padding: '18px 32px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            height: '15%',
            boxShadow: '0 -5px 15px rgba(0,0,0,0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center', 
              gap: 1.5,
            }}
          >
            <Logo large />
            <Typography
              component="h5"
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '1.6rem',
                textTransform: 'capitalize',
                lineHeight: 1, 
              }}
            >
              Touch to start
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
