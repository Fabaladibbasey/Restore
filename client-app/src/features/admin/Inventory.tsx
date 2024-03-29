import {
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { currencyFormat } from "../../app/util/util";
import useProducts from "../../app/hooks/useProducts";
import AppPagination from "../../app/components/AppPagination";
import { removeProduct, setProductParams } from "../catalog/catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useState } from "react";
import { Product } from "../../app/models/product";
import ProductForm from "./ProductForm";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";

export default function Inventory() {
  const { products, metaData } = useProducts();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  const [loading, setLoading] = useState("");

  const handleSelectedProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  const handleRemoveProduct = async (id: number) => {
    try {
      setLoading("deleting" + id);
      await agent.Admin.deleteProduct(id.toString());
      dispatch(removeProduct(id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading("");
    }
  };

  const cancelEditMode = () => {
    setSelectedProduct(undefined);
    setEditMode(false);
  };

  if (editMode)
    return (
      <ProductForm product={selectedProduct} cancelEditMode={cancelEditMode} />
    );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Inventory
        </Typography>
        <Button
          onClick={() => setEditMode(true)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={product.pictureUrl}
                      alt={product.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(product.price)}
                </TableCell>
                <TableCell align="center">{product.type}</TableCell>
                <TableCell align="center">{product.brand}</TableCell>
                <TableCell align="center">{product.quantityInStock}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectedProduct(product)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading === "deleting" + product.id}
                    onClick={() => handleRemoveProduct(product.id)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {metaData && (
        <Grid item xs={12} md={9} sx={{ mt: 2 }}>
          <AppPagination
            metaData={metaData}
            onPageChange={(page) =>
              dispatch(setProductParams({ pageNumber: page }))
            }
          />
        </Grid>
      )}
    </>
  );
}
