import React, { useContext } from "react";
import { Box, CardActionArea, CardContent, CardMedia, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Store } from "../Store";
import { setOrderType } from "../actions";
import { useStyles } from "../styles";

export default function ChooseScreen() {
  /* ==============================
     HOOKS / CONTEXT
  ============================== */
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  /* ==============================
     HANDLERS
  ============================== */
  const chooseHandler = async (orderType) => {
    try {
      setOrderType(dispatch, orderType);

      const formattedType = orderType.toUpperCase().replace(" ", "_");
      const response = await fetch(
        `http://localhost:7000/order/type?orderType=${formattedType}`,
        { method: "POST" }
      );

      if (!response.ok) {
        alert("Failed to set order type.");
        return;
      }

      navigate("/order");
    } catch (err) {
      alert("Backend not reachable.");
    }
  };

  /* ==============================
     REUSABLE STYLES
  ============================== */
  const optionCardSx = {
    background: "#FFF8E7",
    borderRadius: "28px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    width: 400,
    minHeight: 500,
    p: 3,
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px) scale(1.03)",
      boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
    },
  };

  const labelImageSx = {
    height: 70,
    width: "auto",
    objectFit: "contain",
    display: "block",
  };

  /* ==============================
     UI
  ============================== */
  return (
    <Fade in>
      <Box
        className={styles.chooseRoot}
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
          color: "#fff",

          /* Background image */
          backgroundImage: "url(/images/choose-bg.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background glow overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        {/* Top navbar */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            height: 120,
            width: "100%",
            backgroundColor: "#FFF8E7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          <Box
            component="img"
            src="/images/new-logo.png"
            alt="Navbar Logo"
            sx={{ height: "70%", objectFit: "contain" }}
          />
        </Box>

        {/* Options */}
        <Box
          sx={{
            mt: 16, // space below fixed navbar
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            zIndex: 2,
            pb: 20,
          }}
        >
          {/* DINE IN */}
          <Box sx={optionCardSx}>
            <CardActionArea onClick={() => chooseHandler("Dine in")}>
              <CardMedia
                component="img"
                image="/images/Dinein.png"
                alt="Dine In"
                sx={{
                  width: "100%",
                  height: 330,
                  objectFit: "contain",
                  mb: 2,
                }}
              />
              <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  component="img"
                  src="/images/dinein-txt.png"
                  alt="Dine In label"
                  sx={labelImageSx}
                />
              </CardContent>
            </CardActionArea>
          </Box>

          {/* TAKE OUT */}
          <Box sx={optionCardSx}>
            <CardActionArea onClick={() => chooseHandler("Take out")}>
              <CardMedia
                component="img"
                image="/images/Takeout.png"
                alt="Take Out"
                sx={{
                  width: "100%",
                  height: 330,
                  objectFit: "contain",
                  mb: 2,
                }}
              />
              <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  component="img"
                  src="/images/takeout-txt.png"
                  alt="Take Out label"
                  sx={labelImageSx}
                />
              </CardContent>
            </CardActionArea>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
