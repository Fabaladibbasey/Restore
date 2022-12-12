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

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
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
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add to cart</Button>
        <Button size="small" component={Link} to={`${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
export default ProductCard;
