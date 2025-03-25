import { CalculatorService } from "@src/shared";

export const divide = (
  a: number,
  b: number,
): number | undefined => {
  const calculator = new CalculatorService();
  const result = calculator.division(a, b);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
};
