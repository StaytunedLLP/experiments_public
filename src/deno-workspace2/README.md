# Project Structure Documentation

This project is a Deno workspace (`deno.json` at root) containing two feature-defined calculators and a shared module within the `src` directory.

**Root Level:**

- `README.md`: Project description, including notes on Deno module resolution with import maps.
- `deno.json`: Deno workspace configuration, defining `./src/fd_calculator`, `./src/fd_calculator2`, and `./src/.shared` as workspace members.
- `src/`: Source code directory.

**`src/` Directory:**
Contains two main feature folders, a shared module, and the main application entrypoint:

- `main.ts`:  Application entry point, demonstrating usage of modules from both calculators and the shared service.
- `.shared/`:  Contains shared modules and services.
  - `bk_services/`: Backend services.
    - `calculator.service.ts`:  Implements `CalculatorService` with basic arithmetic operations and a `Result` type for structured responses.
    - `mod.ts`: Exports modules from `bk_services`, currently exporting `calculator.service.ts`.
  - `deno.json`: Package configuration for `@src/shared`, exporting `mod.ts`.
  - `mod.ts`: Entry point for the shared module, exporting from `bk_services/mod.ts`.
- `fd_calculator/`: First feature-defined calculator, organized by simple and complex operations.
  - `deno.json`: Package configuration for `@src/fd_calculator`, defining exports for different feature modules.
  - `mod.ts`: Entry point for `fd_calculator` module.
  - `fe_simple/`: Simple arithmetic features (addition, subtraction).
    - `sy_addition/`, `sy_subtraction/`:  Each contains `addition.ts`/`subtraction.ts` (implementation using `CalculatorService` from `@src/shared`) and `mod.ts` (exports operation function).
    - `mod.ts`: Entry point for `fe_simple`.
  - `fe_complex/`: Complex arithmetic features (multiplication, division).
    - `sy_division/`, `sy_multiplication/`: Each contains `division.ts`/`multiplication.ts` (implementation using `CalculatorService` from `@src/shared`) and `mod.ts` (exports operation function).
    - `mod.ts`: Entry point for `fe_complex`.
- `fd_calculator2/`: Second feature-defined calculator, with potentially different operation groupings.
  - `deno.json`: Package configuration for `@src/fd_calculator2`, defining exports for different feature modules.
  - `mod.ts`: Entry point for `fd_calculator2` module.
  - `fe_complex/`: Complex operations, grouped as `sy_add_and_subtract` and `sy_multiply_and_divide`.
    - `sy_add_and_subtract/`: Contains `add_and_subtract.ts` (combining addition and subtraction using imports from `fd_calculator`) and `mod.ts`.
    - `sy_multiply_and_divide/`: Contains `multiply_and_divide.ts` (combining multiplication and division using imports from `fd_calculator`) and `mod.ts`.
    - `mod.ts`: Entry point for `fe_complex` in `fd_calculator2`.

**Module Structure and Imports:**

- Each feature module (`fd_calculator`, `fd_calculator2`, `.shared`) and sub-modules has a `deno.json` defining its package name and exports.
- `mod.ts` files are used to aggregate and export functionalities at each level (feature, operation, etc.).
- Modules within calculators import functionalities from other modules (e.g., `fd_calculator2` using `fd_calculator` operations) and the shared `CalculatorService` (`@src/shared`).
- `main.ts` imports functions from specific operation modules within both calculators using defined import paths (e.g., `@src/fd_calculator/fe_simple/sy_addition`).
