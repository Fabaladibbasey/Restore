import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Typography } from "@mui/material";

const stripePromise = loadStripe(
  "pk_test_51Mue8fLYq7vm0Fr2W9vtr6xESromWTMIifztHP2Lhh79E42CQJaigD2LK5LJZ6dbmqh5PeQgUhm2s8dnezymOXXo00N2lRo1fi"
);

function CheckoutWrapper() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { basket } = useAppSelector((state) => state.basket);

  useEffect(() => {
    setLoading(true);
    agent.Payments.createPaymentIntent()
      .then((basket) => {
        dispatch(setBasket(basket));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const options = {
    clientSecret: basket?.clientSecret,
  };

  if (loading) return <LoadingComponent message="Loading checkout..." />;

  if (!basket || !basket.items || basket.items.length === 0)
    return (
      <Typography>
        Your Basket is Empty, sorry you can't proceed with checkout
      </Typography>
    );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutPage basket={basket} />
    </Elements>
  );
}
export default CheckoutWrapper;
