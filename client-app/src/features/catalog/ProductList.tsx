import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

function ProductList({ products }: Props) {
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {products.map((product) => (
          <Grid
            item
            container
            xs={12}
            sm={6}
            md={4}
            lg={3}
            justifyContent="center"
            key={product.id}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ProductList;
