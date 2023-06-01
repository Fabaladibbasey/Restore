import { useEffect } from "react";
import {
  fetchProductsAsync,
  fetchFiltersAsync,
  selectProducts,
} from "../../features/catalog/catalogSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

function useProducts() {
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, metaData } =
    useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [dispatch, filtersLoaded]);

  return { brands, filtersLoaded, productsLoaded, types, products, metaData };
}
export default useProducts;
