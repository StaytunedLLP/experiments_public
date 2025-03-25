# README.md for deno-workspace-not-working

## Differences from deno-workspace-working

This `deno-workspace-not-working` project builds upon the structure of `deno-workspace-working` but introduces a key change: the addition of `deno.json` files within feature folders (`fe_simple`, `fe_complex`) and story folders (`sy_addition`, `sy_subtraction`, etc.).

**deno-workspace-working:**

```tree
|-- README.md
|-- deno.json
`-- src
    |-- fd_calculator
    |   |-- deno.json
    |   |-- fe_complex
    |   |   |-- mod.ts
    |   |   |-- sy_division
    |   |   |   |-- division.ts
    |   |   |   `-- mod.ts
    |   |   `-- sy_multiplication
    |   |       |-- mod.ts
    |   |       `-- multiplication.ts
    |   |-- fe_simple
    |   |   |-- mod.ts
    |   |   |-- sy_addition
    |   |   |   |-- addition.ts
    |   |   |   `-- mod.ts
    |   |   `-- sy_subtraction
    |   |       |-- mod.ts
    |   |       `-- subtraction.ts
    |   `-- mod.ts
    |-- fd_calculator2
    |   |-- deno.json
    |   |-- fe_complex
    |   |   |-- mod.ts
    |   |   |-- sy_add_and_subtract
    |   |   |   |-- add_and_subtract.ts
    |   |   |   `-- mod.ts
    |   |   `-- sy_multiply_and_divide
    |   |       |-- mod.ts
    |   |       `-- multiply_and_divide.ts
    |   `-- mod.ts
    `-- main.ts
```

**deno-workspace-not-working:**

```tree
|-- README.md
|-- deno.json (deno.json)
`-- src
    |-- fd_calculator
    |   |-- deno.json (deno.json)
    |   |-- fe_complex
    |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |-- mod.ts
    |   |   |-- sy_division
    |   |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |   |-- division.ts
    |   |   |   `-- mod.ts
    |   |   `-- sy_multiplication
    |   |       |-- **deno.json (deno.json)  // when added this fails**
    |   |       |-- mod.ts
    |   |       `-- multiplication.ts
    |   |-- fe_simple
    |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |-- mod.ts
    |   |   |-- sy_addition
    |   |   |   |-- addition.ts
    |   |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |   `-- mod.ts
    |   |   `-- sy_subtraction
    |   |       |-- **deno.json (deno.json)  // when added this fails**
    |   |       |-- mod.ts
    |   |       `-- subtraction.ts
    |   `-- mod.ts
    |-- fd_calculator2
    |   |-- deno.json (deno.json)
    |   |-- fe_complex
    |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |-- mod.ts
    |   |   |-- sy_add_and_subtract
    |   |   |   |-- add_and_subtract.ts
    |   |   |   |-- **deno.json (deno.json)  // when added this fails**
    |   |   |   `-- mod.ts
    |   |   `-- sy_multiply_and_divide
    |   |       |-- **deno.json (deno.json)  // when added this fails**
    |   |       |-- mod.ts
    |   |       `-- multiply_and_divide.ts
    |   `-- mod.ts
    `-- main.ts
```

**Purpose of Added `deno.json` Files in deno-workspace-not-working**

The intention behind adding these `deno.json` files at deeper levels in `deno-workspace-not-working` was likely to allow for specific configurations or dependencies to be defined at the feature or story level.  In this example, these `deno.json` files are mostly empty or not explicitly defining exports to highlight the issue that even the presence of these files causes problems.

**The Problem:**

However, as noted, adding these nested `deno.json` files introduces a significant issue:

- **Red Squiggles and Broken Import Navigation:**  The Deno VS Code extension (and potentially Deno's language server in general) seems to struggle with resolving modules correctly when `deno.json` files are nested this deeply within a workspace. This results in:
  - Red squiggly lines appearing under import paths in code editors, falsely indicating errors.
  - "Go to Definition" and "Find All References" features for imports become unreliable or completely broken.

This issue is specifically demonstrated in `deno-workspace-not-working`. In contrast, `deno-workspace-working`, which lacks these nested `deno.json` files, does not exhibit this problem and provides a smoother development experience.
