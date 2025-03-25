import { add } from "@src/fd_calculator/fe_simple/sy_addition";
import { subtract } from "@src/fd_calculator/fe_simple/sy_subtraction";

//#region Combined Operations
export const addAndSubtract = (
    a: number, 
    b: number, 
    c: number
): number | undefined => {
    const addResult = add(a, b);
    if (addResult !== undefined) {
        return subtract(addResult, c);
    }
    return undefined;
};

export const doubleAdd = (a: number, b: number): number | undefined => {
    const firstAdd = add(a, b);
    if (firstAdd !== undefined) {
        return add(firstAdd, firstAdd);
    }
    return undefined;
};
//#endregion