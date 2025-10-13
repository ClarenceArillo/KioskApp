import React, { useContext, useEffect, useState } from 'react';
import { useStyles } from '../styles';
import { Box, Grid, List, ListItem, Avatar, CircularProgress, Alert, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { listCategories, listProducts } from '../actions';
import { Store } from '../Store';
import Logo from '../components/Logo';

export default function OrderScreen() {
  const styles = useStyles();
  const [categoryName, setCategoryName] = useState('');
  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;

  useEffect(() => {
  listCategories(dispatch);
  }, [dispatch]);

  useEffect(() => {
  listProducts(dispatch, categoryName);
  }, [dispatch, categoryName]);


  const categoryClickHandler = (name) => {
    setCategoryName(name);
    listProducts(dispatch, categoryName);
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.main}>
        <Grid container>
          <Grid item md={2}>
            <List>
              {loading ? ( 
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <>
                  <ListItem onClick={() => categoryClickHandler('')} button>
                    <Logo> </Logo>
                  </ListItem>
                  {categories.map((category) => (
                    <ListItem button key={category.name}
                    onClick={() => categoryClickHandler(category.name)}
                    >
                      <Avatar alt={category.name} src={category.image} />
                    </ListItem>
                  ))}
                </>
              )}
              <ListItem>
                <Avatar src="/images/newmeals.png" />
              </ListItem>
            </List>
          </Grid>
          <Grid item md={10}>
          <Typography
            gutterBottom
            className={styles.title}
            variant="h2"
            component="h2"
          >
            {categoryName || 'Main Menu'}
          </Typography>
          <Grid container spacing={1}>
          {loadingProducts ? (
            <CircularProgress />
          ) : errorProducts ? (
            <Alert severity="error">{errorProducts}</Alert>
          ) : (
            products.map((product) => ( <Grid item xs={12} sm={6} md={4}>
              <Card
                className={styles.card}
              >
              <CardActionArea>
              <CardMedia 
              component="img"
              alt={product.name}
              image={product.image}
              className={styles.menuImage}
              />
              </CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  className={styles.title}
                  variant="body2"
                  color="textPrimary"
                  component="p"
                >
                  {product.name}
                </Typography>
                <Box className={styles.cardFooter}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  ${product.price}
                </Typography>
                </Box>
              </CardContent> 
              </Card>
            </Grid> ))
          )}
          </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
