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
      <Box
        className={`${styles.chooseRoot}`}
        sx={{
          backgroundColor: "#ff2040",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          overflow: "hidden",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        {/* 🔷 Subtle Glow Background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />

        {/* 🟢 Logo */}
        <Box sx={{ zIndex: 2 }}>
          <Logo large />
        </Box>

        {/* 🏷️ Title */}
        <Typography
          component="h3"
          variant="h3"
          sx={{
            marginTop: 4,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: "0 3px 8px rgba(0,0,0,0.25)",
            zIndex: 2,
          }}
        >
          Where will you be eating today?
        </Typography>

        {/* 🍽️ Choose Options */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
            flexWrap: "wrap",
            zIndex: 2,
          }}
        >
          {/* DINE IN */}
          <Box
            sx={{
              background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
              borderRadius: "28px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              width: 280,
              padding: 3,
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px) scale(1.03)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardActionArea onClick={() => chooseHandler("Dine in")}>
              <CardMedia
                component="img"
                alt="Dine in"
                image="/images/Dinein.png"
                sx={{
                  width: "100%",
                  height: 210,
                  objectFit: "contain",
                  marginBottom: 2,
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                }}
              />
              <CardContent>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{
                    fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    fontWeight: 800,
                    color: "#ff2040",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    textAlign: "center",
                    textShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  Dine In
                </Typography>
              </CardContent>
            </CardActionArea>
          </Box>

          {/* TAKE OUT */}
          <Box
            sx={{
              background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
              borderRadius: "28px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              width: 280,
              padding: 3,
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px) scale(1.03)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardActionArea onClick={() => chooseHandler("Take out")}>
              <CardMedia
                component="img"
                alt="Take out"
                image="/images/Takeout.png"
                sx={{
                  width: "100%",
                  height: 210,
                  objectFit: "contain",
                  marginBottom: 2,
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                }}
              />
              <CardContent>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{
                    fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    fontWeight: 800,
                    color: "#00b020",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    textAlign: "center",
                    textShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  Take Out
                </Typography>
              </CardContent>
            </CardActionArea>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
