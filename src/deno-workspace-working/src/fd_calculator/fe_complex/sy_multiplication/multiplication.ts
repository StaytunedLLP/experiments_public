import { CalculatorService } from "@src/shared";

export const multiply = (
  a: number,
  b: number,
): number | undefined => {
  const calculator = new CalculatorService();
  const result = calculator.multiply(a, b);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
};
