import { InputBaseComponentProps } from "@mui/material";
import { Ref, forwardRef, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps {}

const StripeInput = forwardRef(function StripeInput(
  { component: Component, ...props }: Props,
  ref: Ref<unknown>
) {
  const elementRef = useRef<unknown>();

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (elementRef.current) {
        (elementRef.current as any).focus();
      }
    },
    blur: () => {
      if (elementRef.current) {
        (elementRef.current as any).blur();
      }
    },
    clear: () => {
      if (elementRef.current) {
        (elementRef.current as any).clear();
      }
    },
    update: (options: any) => {
      if (elementRef.current) {
        (elementRef.current as any).update(options);
      }
    },
    getElement: () => {
      if (elementRef.current) {
        return elementRef.current;
      }
    },
  }));

  return (
    <Component
      {...props}
      onReady={(element: any) => (elementRef.current = element)}
    />
  );
});

export default StripeInput;
