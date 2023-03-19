import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFiltersAsync,
  fetchProductsAsync,
  selectProducts,
  setProductParams,
} from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

function Catalog() {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "priceAsc", label: "Price - Low to high" },
  ];

  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();
  const {
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [dispatch, filtersLoaded]);

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <>
      <Paper sx={{ mb: 2 }}>
        <ProductSearch />
      </Paper>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
              options={sortOptions}
              seletedValue={productParams.orderBy}
              onChange={(e) =>
                dispatch(setProductParams({ orderBy: e.target.value }))
              }
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              title="Brands"
              items={brands}
              checkedItems={productParams.brands || []}
              onChange={(checked) =>
                dispatch(setProductParams({ brands: checked }))
              }
            />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              title="Types"
              items={types}
              checkedItems={productParams.types || []}
              onChange={(checked) =>
                dispatch(setProductParams({ types: checked }))
              }
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <ProductList products={products} />
        </Grid>

        <Grid item xs={3}></Grid>
        <Grid item xs={12} md={9} sx={{ mt: 2 }}>
          {metaData && (
            <AppPagination
              metaData={metaData}
              onPageChange={(page) =>
                dispatch(setProductParams({ pageNumber: page }))
              }
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default Catalog;
