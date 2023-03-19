import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>(
    productParams.searchTerm || ""
  );

  const handleSearch = debounce((e: any) => {
    dispatch(setProductParams({ searchTerm: e.target.value }));
  }, 1000);

  return (
    <TextField
      id="outlined-basic"
      label="Search"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        handleSearch(e);
      }}
    />
  );
}
export default ProductSearch;
