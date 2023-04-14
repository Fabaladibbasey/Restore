import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";

interface Props {
  isBasket?: boolean;
  subTotal?: number;
}

export default function BasketSummary({ isBasket = true, subTotal }: Props) {
  const { basket } = useAppSelector((state) => state.basket);
  const deliveryFee = basket?.subTotal! > 10000 ? 0 : 500;

  const getSubTotal = () => {
    return isBasket ? basket?.subTotal! : subTotal!;
  };

  const getTotal = () => {
    return isBasket ? basket?.subTotal! + deliveryFee : subTotal! + deliveryFee;
  };

  return (
    <>
      <TableContainer
        component={Paper}
        variant={"outlined"}
        sx={{ marginTop: 2 }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">
                {currencyFormat(getSubTotal())}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{currencyFormat(getTotal())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
