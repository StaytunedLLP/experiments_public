# Dagger and Deno

## Project Structure

```plaintext
example/
|__server.ts
```

For local development instructions using Deno, see
[the example README](./example/README.md).

## Current Issues

### Issue 1: Localhost Setup Issue

When running the command `dagger call`, the localhost environment is not being set up properly. This prevents the application from running correctly.

**Steps to Reproduce:**

1. Navigate to `src/poc_dagger_deno`
2. Run:

```bash
dagger call deno-run --source=../../example up
```

**Expected Behavior:**

- Localhost should be properly configured
- Application should start and be accessible

**Current Behavior:**

- Localhost setup fails
- Application cannot be accessed

