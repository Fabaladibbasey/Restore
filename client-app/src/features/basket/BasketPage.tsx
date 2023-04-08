import { Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, selectProducts } from "../catalog/catalogSlice";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage() {
  const { basket } = useAppSelector((state) => state.basket);
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  const products = useAppSelector(selectProducts);

  if (!basket || !basket.items || basket.items.length === 0 || !products)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <BasketTable items={basket.items} products={products} />
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
