import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from "@mui/material";
import { currencyFormat } from "../../app/util/util";
import { removeItemFromBasketAsync, addBasketItemAsync } from "./basketSlice";
import { BasketItem } from "../../app/models/basket";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";

interface Props {
  items: BasketItem[];
  isBasket?: boolean;
}

function BasketTable({ items, isBasket = true }: Props) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    src={item.pictureUrl}
                    alt={item.productName}
                    style={{ height: 50, marginRight: 20 }}
                  />
                  <span>{item.productName}</span>
                </Box>
              </TableCell>
              <TableCell align="right">
                ${(item.price / 100).toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                {isBasket && (
                  <LoadingButton
                    loading={
                      status ===
                      "pendingRemoveItem" + item.productId + "removeOne"
                    }
                    onClick={() =>
                      dispatch(
                        removeItemFromBasketAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: "removeOne",
                        })
                      )
                    }
                    color="error"
                  >
                    <Remove />
                  </LoadingButton>
                )}

                <Typography style={{ margin: "12px 0px" }}>
                  {item.quantity}
                </Typography>

                {isBasket && (
                  <LoadingButton
                    loading={status === "pendingAddItem" + item.productId}
                    disabled={item.quantity >= item.quantityInStock}
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                        })
                      )
                    }
                    color="secondary"
                  >
                    <Add />
                  </LoadingButton>
                )}
              </TableCell>
              <TableCell align="right">
                {currencyFormat(item.price * item.quantity)}
              </TableCell>
              {isBasket && (
                <TableCell align="right">
                  <LoadingButton
                    loading={
                      status ===
                      "pendingRemoveItem" + item.productId + "removeAll"
                    }
                    onClick={() =>
                      dispatch(
                        removeItemFromBasketAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: "removeAll",
                        })
                      )
                    }
                    color="error"
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default BasketTable;
