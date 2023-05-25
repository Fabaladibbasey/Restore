import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync } from "../catalog/catalogSlice";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage() {
  const { basket } = useAppSelector((state) => state.basket);
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  if (!basket || !basket.items || basket.items.length === 0)
    return (
      <Box
        style={{
          width: "100%",
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" align="center">
          Your Basket is Empty, sorry there is nothing to View
        </Typography>
        <Button
          sx={{ width: 300, margin: "20px auto" }}
          size="small"
          component={Link}
          to="/catalog"
        >
          Go to Catalog
        </Button>
      </Box>
    );

  return (
    <>
      <BasketTable items={basket.items} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={12} md={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
