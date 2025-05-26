import React from "react";
import { Stepper, Step } from "react-form-stepper";

const CheckoutStepper = ({ activeStep }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Stepper
        activeStep={activeStep}
        styleConfig={{
          activeBgColor: "#8b5cf6", // violet-500
          completedBgColor: "#22c55e", // green-500
          inactiveBgColor: "#e5e7eb", // gray-200
          activeTextColor: "#fff",
          completedTextColor: "#fff",
          inactiveTextColor: "#6b7280", // gray-500
          size: "2em",
          circleFontSize: "1em",
          labelFontSize: "1em",
          borderRadius: "50%",
        }}
        stepClassName="step"
        className="w-full"
      >
        <Step label="Shipping Info" />
        <Step label="Confirm Order" />
        <Step label="Payment" />
      </Stepper>
    </div>
  );
};

export default CheckoutStepper;
