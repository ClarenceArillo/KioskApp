import React, { useContext } from 'react';
import Logo from '../components/Logo';
import { Box, Card, CardActionArea, CardContent, CardMedia, Fade, Typography } from '@mui/material';
import { useStyles } from '../styles';
import { setOrderType } from '../actions';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store'; 

export default function ChooseScreen() {
  const styles = useStyles()  
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const chooseHandler = (orderType) => {
    setOrderType(dispatch, orderType);
    navigate('/order');
  }

  return (
  <Fade in={true}>
    <Box className={`${styles.chooseRoot} ${styles.red}`}>
        <Logo/>
      <Typography component="h3" variant="h3" className={styles.center} gutterBottom>
        Where will you be eating today?
      </Typography>
      <Box className={styles.cards}>
        <CardActionArea onClick={() => chooseHandler('Eat in')}>
          <CardMedia component="img" alt="Eat in" image="/images/eatin.png" className={styles.media}/>
          <CardContent>
            <Typography gutterBottom variant="h4" color="textPrimary" component="p"> 
              Eat in
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActionArea onClick={() => chooseHandler('Take out')}>
          <CardMedia component="img" alt="Take out" image="/images/takeout.png" className={styles.media}/>
          <CardContent>
            <Typography gutterBottom variant="h4" color="textPrimary" component="p">
              Take out
            </Typography>
          </CardContent>
        </CardActionArea>                    
      </Box>
    </Box>
  </Fade>
);
}
