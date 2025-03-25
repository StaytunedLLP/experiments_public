//#region Imports
export type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
//#endregion

//#region Interface
export interface ICalculatorService {
  add(a: number, b: number): Result<number>;
  subtract(a: number, b: number): Result<number>;
  multiply(a: number, b: number): Result<number>;
  division(a: number, b: number): Result<number>;
}
//#endregion

//#region Implementation
export class CalculatorService implements ICalculatorService {
  /**
   * Adds two numbers together
   * @param a First number
   * @param b Second number
   * @returns Result containing the sum or error
   */
  public add(a: number, b: number): Result<number> {
    try {
      if (!this.isValidNumber(a) || !this.isValidNumber(b)) {
        return {
          success: false,
          error: "Invalid input: Both parameters must be valid numbers",
        };
      }

      const result = a + b;
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error performing addition: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Subtracts second number from first number
   * @param a First number
   * @param b Second number
   * @returns Result containing the difference or error
   */
  public subtract(a: number, b: number): Result<number> {
    try {
      if (!this.isValidNumber(a) || !this.isValidNumber(b)) {
        return {
          success: false,
          error: "Invalid input: Both parameters must be valid numbers",
        };
      }

      const result = a - b;
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error performing subtraction: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Multiplies two numbers
   * @param a First number
   * @param b Second number
   * @returns Result containing the product or error
   */
  public multiply(a: number, b: number): Result<number> {
    try {
      if (!this.isValidNumber(a) || !this.isValidNumber(b)) {
        return {
          success: false,
          error: "Invalid input: Both parameters must be valid numbers",
        };
      }

      const result = a * b;
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error performing multiplication: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Divides first number by second number
   * @param a First number
   * @param b Second number
   * @returns Result containing the quotient or error
   */
  public division(a: number, b: number): Result<number> {
    try {
      if (!this.isValidNumber(a) || !this.isValidNumber(b)) {
        return {
          success: false,
          error: "Invalid input: Both parameters must be valid numbers",
        };
      }
      if (b === 0) {
        return {
          success: false,
          error: "Division by zero is not allowed",
        };
      }
      const result = a / b;
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error performing division: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Validates if the input is a valid number
   * @param num Number to validate
   * @returns boolean indicating if number is valid
   */
  private isValidNumber(num: number): boolean {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }
}
//#endregion

//#region Export
export const calculatorService = new CalculatorService();
export default calculatorService;
//#endregion