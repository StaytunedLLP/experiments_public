import { add } from "@src/fd_calculator/fe_simple/sy_addition";
import { multiply } from "@src/fd_calculator/fe_complex/sy_multiplication";
import { divide } from "@src/fd_calculator/fe_complex/sy_division";

//#region Mixed Operations
export const multiplyAndDivide = (
    a: number,
    b: number,
    c: number
): number | undefined => {
    const multResult = multiply(a, b);
    if (multResult !== undefined) {
        return divide(multResult, c);
    }
    return undefined;
};

export const complexOperation = (
    a: number,
    b: number,
    c: number
): number | undefined => {
    const addResult = add(a, b);
    if (addResult !== undefined) {
        const multResult = multiply(addResult, c);
        if (multResult !== undefined) {
            return divide(multResult, 2);
        }
    }
    return undefined;
};
//#endregion