# Deno Multi-Root Workspace

A demonstration project showing how to integrate multiple Node.js packages within a Deno workspace.

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

To use the local modules in the Deno application, add them to the imports
section in `deno_app/deno.json`:

```json
{
  "imports": {
    "package1": "../package1/index.js",
    "package2": "../package2/dist/index.js"
  }
}
```

## Getting Started

1. Clone this repository
2. Navigate to the `src/poc_dagger_deno_local_module/deno_app` directory
3. Run the application using `deno task run_deno_app`

## Notes

- Zero unstable features
- No npm dependencies
- Automatic dependency resolution by Deno
- Performing build step of `package2` using `deno task build` which internally use build script of `package.json`.