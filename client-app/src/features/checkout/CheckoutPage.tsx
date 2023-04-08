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

const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector((state) => state.account);
  const { basket } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });

  useEffect(() => {
    if (activeStep === 0 && user?.userAddress) {
      methods.reset({
        ...user.userAddress,
        saveAddress: true,
      });
    }
  }, [activeStep, methods, user?.userAddress]);

  const handleNext = async (data: FieldValues) => {
    const { nameOnCard, saveAddress, ...shippingAddress } = data;
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const order = await agent.Orders.create({
          saveAddress,
          shippingAddress,
        });
        setOrderNumber(order.id);
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  if (!orderNumber && (!basket || !basket.items || basket.items.length === 0))
    return <Typography variant="h3">Your basket is empty</Typography>;

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
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #{orderNumber}. We have not emailed your
                order confirmation, and will not send you an update when your
                order has shipped as this is a fake store!
              </Typography>
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
                  disabled={!methods.formState.isValid}
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
