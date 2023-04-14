import { LoadingButton } from "@mui/lab";
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import agent from "../../app/api/agent";
import { validationSchema } from "./checkoutValidation";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import { StripeElementType } from "@stripe/stripe-js";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Basket } from "../../app/models/basket";
import { fetchCurrentUser } from "../account/accountSlice";

const steps = ["Shipping address", "Review your order", "Payment details"];

interface Props {
  basket: Basket;
}

function CheckoutPage({ basket }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string };
  }>({
    elementError: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const [cardComplete, setCardComplete] = useState<{
    [key in StripeElementType]?: boolean;
  }>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const handleCardInputChange = (event: any) => {
    setCardState((prevState) => ({
      ...prevState,
      elementError: {
        ...prevState.elementError,
        [event.elementType]: event.error?.message,
      },
    }));

    setCardComplete((prevState) => ({
      ...prevState,
      [event.elementType]: event.complete,
    }));
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return (
          <PaymentForm
            cardState={cardState}
            onCardInputChange={handleCardInputChange}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });

  useEffect(() => {
    if (!user?.userAddress) {
      dispatch(fetchCurrentUser());
    }
    if (activeStep === 0 && user?.userAddress) {
      methods.reset({
        ...user.userAddress,
        saveAddress: true,
      });
    }
  }, []);

  async function submitOrder(data: FieldValues) {
    const { nameOnCard, saveAddress, ...shippingAddress } = data;
    setLoading(true);
    if (!stripe || !elements) return; // Stripe.js has not yet loaded.
    try {
      const cardElement = elements.getElement(CardNumberElement);
      //get payment
      const paymentResult = await stripe.confirmCardPayment(
        basket?.clientSecret!,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: nameOnCard,
            },
          },
        }
      );

      if (paymentResult.paymentIntent?.status === "succeeded") {
        setPaymentSucceeded(true);
        setPaymentMessage("Payment succeeded");
        const order = await agent.Orders.create({
          saveAddress,
          shippingAddress,
        });
        setOrderNumber(order.id);
        dispatch(clearBasket());
      } else {
        setPaymentMessage(paymentResult.error?.message || "Payment failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      await submitOrder(data);
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function submitDisabled(): boolean {
    if (activeStep === steps.length - 1) {
      return (
        !cardComplete.cardNumber ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardCvc
      );
    } else {
      return !methods.formState.isValid;
    }
  }

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                {paymentMessage}
              </Typography>

              {paymentSucceeded && orderNumber ? (
                <Typography variant="subtitle1">
                  Your order number is #{orderNumber}. We have not emailed your
                  order confirmation, and will not send you an update when your
                  order has shipped as this is a fake store!
                </Typography>
              ) : (
                <>
                  {paymentSucceeded && !orderNumber && (
                    <Typography variant="subtitle1">
                      There was an error processing your order. Please try again
                      later. Note: will ensure that the payment is not charged
                      twice or that you're refunded. If the problem persists,
                      please contact us.
                    </Typography>
                  )}
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 3, ml: 1 }}
                    variant="contained"
                  >
                    Go back and try again
                  </Button>
                </>
              )}
            </>
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}

export default CheckoutPage;
