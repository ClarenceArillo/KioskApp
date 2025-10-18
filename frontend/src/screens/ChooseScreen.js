import React, { useContext } from 'react';
import Logo from '../components/Logo';
import { Box, CardActionArea, CardContent, CardMedia, Fade, Typography, Card } from '@mui/material';
import { useStyles } from '../styles';
import { setOrderType } from '../actions';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

export default function ChooseScreen() {
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const chooseHandler = async (orderType) => {
    try {
      setOrderType(dispatch, orderType);

      const formattedType = orderType.toUpperCase().replace(' ', '_'); 
      const response = await fetch(
        `http://localhost:7000/order/type?orderType=${formattedType}`,
        { method: 'POST' }
      );

      if (response.ok) {
        console.log('✅ Order type set successfully:', formattedType);
        navigate('/order'); 
      } else {
        const errMsg = await response.text();
        console.error('❌ Failed to set order type:', errMsg);
        alert('Failed to set order type. Check backend connection.');
      }
    } catch (err) {
      console.error('⚠️ Error connecting to backend:', err);
      alert('Backend not reachable. Please ensure the Spring Boot server is running on port 7000.');
    }
  };

  return (
    <Fade in={true}>
      <Box className={`${styles.chooseRoot} ${styles.red}`}>
        <Logo />
        <Typography component="h3" variant="h3" className={styles.center} gutterBottom>
          Where will you be eating today?
        </Typography>

        <Box className={styles.cardsContainer}>
          <Card className={styles.choiceCard}>
            <CardActionArea className={styles.cardActionArea} onClick={() => chooseHandler('Dine in')}>
              <CardMedia
                component="img"
                alt="Dine in"
                image="/images/Dinein.png"
                className={styles.choiceMedia}
              />
              <CardContent className={styles.cardContent}>
                <Typography gutterBottom variant="h4" color="textPrimary" component="p" className={styles.choiceText}>
                  DINE IN
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className={styles.choiceCard}>
            <CardActionArea className={styles.cardActionArea} onClick={() => chooseHandler('Take out')}>
              <CardMedia
                component="img"
                alt="Take out"
                image="/images/Takeout.png"
                className={styles.choiceMedia}
              />
              <CardContent className={styles.cardContent}>
                <Typography gutterBottom variant="h4" color="textPrimary" component="p" className={styles.choiceText}>
                  TAKE OUT
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Fade>
  );
}