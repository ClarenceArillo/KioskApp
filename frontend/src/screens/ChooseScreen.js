import React, { useContext } from "react";
import Logo from "../components/Logo";
import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,
  Typography,
} from "@mui/material";
import { useStyles } from "../styles";
import { setOrderType } from "../actions";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";

export default function ChooseScreen() {
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const chooseHandler = async (orderType) => {
    try {
      
      setOrderType(dispatch, orderType);

      const formattedType = orderType.toUpperCase().replace(" ", "_");
      const response = await fetch(
        `http://localhost:7000/order/type?orderType=${formattedType}`,
        { method: "POST" }
      );

      if (response.ok) {
        console.log("✅ Order type set successfully:", formattedType);
        navigate("/order");
      } else {
        const errMsg = await response.text();
        console.error("❌ Failed to set order type:", errMsg);
        alert("Failed to set order type. Check backend connection.");
      }
    } catch (err) {
      console.error("⚠️ Error connecting to backend:", err);
      alert(
        "Backend not reachable. Please ensure the Spring Boot server is running on port 7000."
      );
    }
  };

  return (
    <Fade in={true}>
      <Box className={`${styles.chooseRoot} ${styles.red}`}>
        {/* Extra Large Logo for ChooseScreen */}
        <Box sx={{ mb: 6 }}>
          <Logo extraLarge />
        </Box>

        <Typography
          component="h3"
          variant="h3"
          className={styles.center}
          gutterBottom
          sx={{
            fontWeight: '800',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: '2.5rem',
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            mb: 8,
          }}
        >
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
