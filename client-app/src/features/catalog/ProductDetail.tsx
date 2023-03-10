import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  addBasketItemAsync,
  removeItemFromBasketAsync,
} from "../basket/basketSlice";
import { fetchProductAsync, selectProductById } from "./catalogSlice";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) => selectProductById(state, id!));
  const { basket, status } = useAppSelector((state) => state.basket);
  const { status: catalogStatus } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(0);
  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) dispatch(fetchProductAsync(id));
  }, [id, item, product, dispatch]);

  function handleInputChange(event: any) {
    if (event.target.value > 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleUpdateCart() {
    let updatedQuantity = item ? quantity - item.quantity : quantity;
    if (quantity === 0 && !item) updatedQuantity = 1;

    const action = updatedQuantity > 0 ? "upsertItem" : "removeItem";

    if (action === "upsertItem") {
      dispatch(
        addBasketItemAsync({
          productId: product!.id,
          quantity: Math.abs(updatedQuantity),
        })
      );
    } else {
      dispatch(
        removeItemFromBasketAsync({
          productId: product!.id,
          quantity: Math.abs(updatedQuantity),
        })
      );
    }
  }

  if (catalogStatus.includes("pendingForProduct"))
    return <LoadingComponent message="Loading product..." />;

  return (
    <>
      {product && (
        <>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <img
                src={product.pictureUrl}
                alt={product.name}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3">{product.name}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h4" color="secondary">
                ${(product.price / 100).toFixed(2)}
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>{product.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Brand</TableCell>
                      <TableCell>{product.brand}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity in stock</TableCell>
                      <TableCell>{product.quantityInStock}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                type="number"
                label="Quantity in Cart"
                fullWidth
                value={quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={item?.quantity === quantity}
                loading={status.includes("pending")}
                onClick={handleUpdateCart}
                sx={{ height: "55px" }}
                color="primary"
                size="large"
                variant="contained"
                fullWidth
              >
                {item ? "Update Quantity" : "Add to Cart"}
              </LoadingButton>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
export default ProductDetail;
