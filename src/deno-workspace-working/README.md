# Project Structure Documentation

This project is a Deno workspace (`deno.json` at root) with two calculators and a shared module in the `src` directory.

**Structure:**

- **`src/`**: Source code root.
  - **`main.ts`**: Application entry point.
  - **`.shared/`**: Shared modules (e.g., `CalculatorService`).
  - **`fd_calculator/`**: First calculator, organized by `fe_simple` (simple ops), `fe_complex` (complex ops), and operation subfolders (`sy_addition`, etc.).
  - **`fd_calculator2/`**: Second calculator, with potentially different operation groupings in `fe_complex`.

**Module Organization:**

- Each feature module (`fd_calculator`, `fd_calculator2`, `.shared`) has a `deno.json` defining its package.
- `mod.ts` files aggregate and export functionalities at each level.
- Modules import from other modules within the workspace (e.g., `fd_calculator2` uses `fd_calculator`, and both use `@src/shared`).
- `main.ts` imports functions from specific operation modules using import paths like `@src/fd_calculator/fe_simple/sy_addition`.

**Key Idea:** This workspace demonstrates a feature-driven modular structure in Deno, with clear separation of concerns and explicit module definitions using `deno.json` at the feature level.
