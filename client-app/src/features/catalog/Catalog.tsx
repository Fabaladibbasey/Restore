import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

function Catalog() {
  const [product, setProduct] = useState<Product[]>([]);
  useEffect(() => {
    fetch("http://localhost:5070/api/products")
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  return (
    <>
      <ProductList products={product} />
    </>
  );
}
export default Catalog;
