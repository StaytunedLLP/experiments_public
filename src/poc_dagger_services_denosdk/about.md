# About Issue

We are attempting to replicate a common Deno development workflow using Dagger,
specifically leveraging the `--watch` flag for live reloading. In a standard
Docker setup, as described in the Deno
[documentation](https://docs.deno.com/runtime/reference/docker/#common-development-workflow)),
changes to local files (e.g., `main.ts`) are immediately reflected in the
running container's exposed port.

However, when we use the Dagger `serve` function, designed to mirror this
behavior, the watch mode does not function as expected. While the service starts
and is accessible at the specified port, modifications to local files are not
detected, and the container does not reload.

**Here's the Dockerfile we are using as a reference:**

```dockerfile
FROM denoland/deno:latest

WORKDIR /app

# Copy only necessary files
COPY deno.json .
COPY main.ts .

WORKDIR /app/
CMD ["deno", "run", "--watch" , "-A", "main.ts"]
```

**And here's the Dagger function we've implemented:**

```typescript
...
@func()
serve(
  source: Directory,
  denoVersion: string = "latest",
  appPort: number = 8000,
): Service {
  const denoImage = `denoland/deno:${denoVersion}`;
  console.log(`Using Deno image: ${denoImage}`);
  console.log(`Application port: ${appPort}`);

  // Deno requires net and read permissions. --watch enables hot reload.
  const command = [
    "deno",
    "run",
    "--watch",        // Enable Deno's file watcher and restart on change
    "--allow-net",    // Allow network access for the server
    "--allow-read",   // Allow reading files (needed for --watch)
    "main.ts"         // Your main application file
  ];
  console.log(`Executing command: ${command.join(" ")}`);

  return dag
    .container()
    .from(denoImage)
    .withMountedDirectory("/app", source)
    .withWorkdir("/app")
    .withExposedPort(appPort)
    .withDefaultArgs(command)
    .asService();
}
```

**Steps to Reproduce:**

1. Run `dagger call serve --source=. up` in a directory containing a Deno
   project with `main.ts`.
2. Observe that the service starts and is accessible at the specified port.
3. Modify the `main.ts` file locally.
4. Observe that the changes are not reflected in the running container.

**Expected Behavior:**

Changes made to local files should trigger a reload of the Deno server within
the Dagger service, reflecting the updates in real-time, similar to the behavior
observed with Docker.

**Actual Behavior:**

The service starts, but local file changes are not detected, and the server does
not reload.
