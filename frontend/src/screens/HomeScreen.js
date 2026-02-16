import React from 'react';
import { Box, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomeScreen() {
  const BOTTOM_NAV_HEIGHT = 500;
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleStart = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axios.post('http://localhost:7000/order/start');
      navigate('/choose');
    } catch {
      alert('Unable to start order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        height: '100vh',
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: 'url(/images/home-bg.png)', // 👈 your full mockup background
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >


      {/* BOTTOM NAVBAR (clickable) */}
      <Box
        onClick={handleStart}
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: BOTTOM_NAV_HEIGHT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          cursor: 'pointer',
          '&:hover img': { transform: 'scale(1.02)' },
        }}
      >
        <Box
          component="img"
          src="/images/bot-navbar.png"
          alt="Bottom Navbar"
          sx={{
            height: '72%',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            pointerEvents: 'none',
            transition: 'transform 0.45s ease',
          }}
        />
      </Box>
    </Card>
  );
}
