import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  CardHeader,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/util/util";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { setBasket } = useStoreContext();

  function handleAddItem(productId: number) {
    setLoading(true);
    agent.Basket.upsertItem(productId)
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  return (
    <Card sx={{ width: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="product">
            {product.name[0]}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontSize: "1.2rem", color: "primary.main" },
        }}
      />
      <CardMedia
        component="img"
        height="140"
        image={product.pictureUrl}
        alt={product.name}
        sx={{ objectFit: "contain", bgcolor: "primary.light" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="secondary">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={loading}
          onClick={() => handleAddItem(product.id)}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button size="small" component={Link} to={`${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
export default ProductCard;
