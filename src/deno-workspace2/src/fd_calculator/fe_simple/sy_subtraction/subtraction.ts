import { CalculatorService } from "@src/shared" ;


export const subtract = (
    a: number,
    b: number,
): number | undefined => {
    const calculator = new CalculatorService();
    const result =  calculator.subtract(a, b);
    if (result.success) {
        return result.data;
    } else {
        throw new Error(result.error);
    }
}