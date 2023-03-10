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
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/util/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.basket);
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
          loading={status === "pendingAddItem" + product.id}
          onClick={() =>
            dispatch(addBasketItemAsync({ productId: product.id }))
          }
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
