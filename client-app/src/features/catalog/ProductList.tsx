import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  products: Product[];
}

function ProductList({ products }: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
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
            justifyContent="center"
            key={product.id}
          >
            {productsLoaded ? (
              <ProductCard product={product} />
            ) : (
              <ProductCardSkeleton />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ProductList;
