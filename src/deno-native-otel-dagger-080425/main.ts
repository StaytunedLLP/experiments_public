// main.ts
import { connect, Directory, Container, Client } from "npm:@dagger.io/dagger@0.18.2"; // Dagger SDK v0.18.2

async function pipeline(client: Client) {
  console.log("Starting Dagger pipeline for Deno Native OTEL...");

  const contextDir: Directory = client.host().directory(".", {
      exclude: ["node_modules", ".git", "dagger.log", "deno.lock"],
  });

  const denoVersion = "2.2.8"; // Deno v2.2.8
  console.log(`Using Deno base image version: ${denoVersion}`);
  const serviceName = "deno-native-otel-in-dagger"; // Define service name for OTEL

  const base: Container = client
    .container()
    .from(`denoland/deno:bin-${denoVersion}`)
    .withDirectory("/app", contextDir)
    .withWorkdir("/app");

  // Define the execution with Native OTEL flags and environment variables
  const runner: Container = base
    // Inject OTEL configuration via environment variables
    // Dagger automatically injects OTEL_EXPORTER_OTLP_ENDPOINT
    .withEnvVariable("OTEL_DENO", "true") // Enable Deno native OTEL
    .withEnvVariable("OTEL_SERVICE_NAME", serviceName) // Set the service name resource attribute
    // Optional: Configure other OTEL env vars like OTEL_RESOURCE_ATTRIBUTES if needed
    // .withEnvVariable("OTEL_RESOURCE_ATTRIBUTES", "deployment.environment=staging,service.instance.id=instance-123")

    .withExec([
      "deno",
      "run",
      "--unstable-otel", // <-- Enable native OTEL features
      // Deno permissions needed by the script:
      "--allow-net",   // For fetch() and runtime's OTLP exporter
      "--allow-env",   // To read OTEL_* environment variables
      "--allow-read",  // To read source file
      "app.ts",        // The script to run
    ]);

  // Execute and capture stdout
  console.log("Executing Deno script with native OTEL inside Dagger container...");
  const output = await runner.stdout();

  console.log("Deno script finished executing.");
  console.log("Script Output:\n---");
  console.log(output);
  console.log("---\nPipeline finished.");
}

// Connect to Dagger engine and run the pipeline
try {
  await connect(
    async (client: Client) => {
      await pipeline(client);
    },
    { LogOutput: Deno.stderr },
  );
} catch (e) {
    console.error("Error running Dagger pipeline:", e);
    if (typeof Deno !== 'undefined' && Deno.exit) {
        Deno.exit(1);
    } else {
        throw e;
    }
}