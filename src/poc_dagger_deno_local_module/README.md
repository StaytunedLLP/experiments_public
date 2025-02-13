# Deno Multi-Root Workspace

This project demonstrates how to use multiple Node.js packages within a Deno workspace.

## Project Structure

The workspace contains three main components:

1. **Package 1**
   - Implemented in JavaScript
   - Uses Node.js
   - ESM module format

2. **Package 2**
   - Implemented in TypeScript
   - Uses Node.js
   - ESM module format

3. **Deno App**
   - Main application
   - Imports both packages locally
   - Configuration in `deno_app/deno.json`

## Local Module Usage

To use the local modules in the Deno application, add them to the imports section in `deno_app/deno.json`:

```json
{
  "imports": {
    "package1": "../package1/mod.js",
    "package2": "../package2/mod.ts"
  }
}
```

## Getting Started

1. Ensure you have both Node.js and Deno installed
2. Clone this repository
3. Navigate to the deno_app directory
4. Run the application using `deno task run`.