

import { add } from "@src/fd_calculator/fe_simple/sy_addition";
import { subtract } from "@src/fd_calculator/fe_simple/sy_subtraction";
import { multiply } from "@src/fd_calculator/fe_complex/sy_multiplication";
import { divide } from "@src/fd_calculator/fe_complex/sy_division";


import {addAndSubtract , doubleAdd} from "@src/fd_calculator2/fe_complex/sy_add_and_subtract";
import { multiplyAndDivide } from "@src/fd_calculator2/fe_complex/sy_multiply_and_divide";

const a = 10;
const b = 5;
const c = 2;


const result1 = add(a, b);
const result2 = subtract(a, b);
const result3 = multiply(a, b);
const result4 = divide(a, b);
const result5 = addAndSubtract(a, b, c);
const result6 = multiplyAndDivide(a, b, c);
const result7 = doubleAdd(a, b);

console.log(`Addition: ${result1}`);
console.log(`Subtraction: ${result2}`);
console.log(`Multiplication: ${result3}`);
console.log(`Division: ${result4}`);
console.log(`Add and Subtract: ${result5}`);
console.log(`Multiply and Divide: ${result6}`);
console.log(`Double Add: ${result7}`);

