# README.md for deno-workspace3

## Differences from deno-workspace2

This `deno-workspace3` project builds upon the structure of `deno-workspace2` but introduces a key change: the addition of `deno.json` files within feature folders (`fe_simple`, `fe_complex`) and story folders (`sy_addition`, `sy_subtraction`, etc.).

**deno-workspace2:**

- Had `deno.json` files at the root of the workspace (`deno-workspace2/deno.json`), in the root `src` directory (`deno-workspace2/src/.shared/deno.json`), and within the feature-defined calculator folders (`deno-workspace2/src/fd_calculator/deno.json`, `deno-workspace2/src/fd_calculator2/deno.json`).
- Module resolution and package scoping were primarily managed at the feature calculator level and the shared module level.

**deno-workspace3:**

- **Adds `deno.json` files to `fe_simple`, `fe_complex`, and `sy_` subfolders:**  For example, you'll find `deno.json` in:
  - `src/fd_calculator/fe_simple/deno.json`
  - `src/fd_calculator/fe_simple/sy_addition/deno.json`
  - `src/fd_calculator/fe_complex/deno.json`
  - `src/fd_calculator/fe_complex/sy_division/deno.json`
  - ...and similarly within `fd_calculator2`.

**Purpose of Added `deno.json` Files**

The intention behind adding these `deno.json` files at deeper levels was likely to allow for specific configurations or dependencies to be defined at the feature or story level, although in the current example, these `deno.json` files are mostly empty or not defining exports.

**The Problem:**

However, as noted , adding these nested `deno.json` files introduces a significant issue:

- **Red Squiggles and Broken Import Navigation:**  The Deno VS Code extension (and potentially Deno's language server in general) seems to struggle with resolving modules correctly when `deno.json` files are nested this deeply within a workspace. This results in:
  - Red squiggly lines appearing under import paths in code editors, falsely indicating errors.
  - "Go to Definition" and "Find All References" features for imports become unreliable or completely broken.

