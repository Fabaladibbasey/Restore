import { Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import useProducts from "../../app/hooks/useProducts";

function Catalog() {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "priceAsc", label: "Price - Low to high" },
  ];

  const dispatch = useAppDispatch();
  const { productParams } = useAppSelector((state) => state.catalog);
  const { filtersLoaded, brands, types, metaData, products } = useProducts();

  const [showFilters, setShowFilters] = useState(false);
  const handleShowFilters = (e: any) => {
    if (e && window.innerWidth < 900) setShowFilters(!showFilters);
    else if (window.innerWidth < 900) setShowFilters(false);
    else setShowFilters(true);
  };

  useEffect(() => {
    window.addEventListener("resize", () => handleShowFilters(null));
    handleShowFilters(null);
    return () =>
      window.removeEventListener("resize", () => handleShowFilters(null));
  }, []);

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <>
      <Paper sx={{ mb: 2 }}>
        <ProductSearch onClick={(e: any) => handleShowFilters(e)} />
      </Paper>
      <Grid container columnSpacing={4}>
        {showFilters && (
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
        )}

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
