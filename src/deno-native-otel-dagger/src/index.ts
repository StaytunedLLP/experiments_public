/**
 * A generated module for Test functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */
import { Container, dag, Directory, func, object } from "@dagger.io/dagger";

@object()
export class Test {
  /**
   * Returns a container that echoes whatever string argument is provided
   */
  @func()
  containerEcho(stringArg: string): Container {
    return dag.container().from("alpine:latest").withExec(["echo", stringArg]);
  }

  /**
   * Returns lines that match a pattern in the files of the provided Directory
   */
  @func()
  async grepDir(directoryArg: Directory, pattern: string): Promise<string> {
    return dag
      .container()
      .from("alpine:latest")
      .withMountedDirectory("/mnt", directoryArg)
      .withWorkdir("/mnt")
      .withExec(["grep", "-R", pattern, "."])
      .stdout();
  }

  /**
   * Runs the Deno application with native OTEL enabled and returns its stdout.
   * Traces are automatically sent to the endpoint configured by Dagger.
   *
   * @param denoVersion The Deno version to use (e.g., "2.2.8") - Defaults to "2.2.8"
   * @param serviceName OTEL Service name - Defaults to "deno-native-otel-module"
   */
  @func()
  async runOtelApp(
    denoVersion: string = "2.2.8",
    serviceName: string = "deno-native-otel-module",
    moduleSource: Directory,
  ): Promise<string> {
    console.log(
      `Starting Dagger Function: runOtelApp (Deno ${denoVersion}, Service ${serviceName})...`,
    );

    // Get the module source directory, which includes app.ts
    // const moduleSource: Directory = dag.currentModule().source();

    console.log(`Using Deno base image version: ${denoVersion}`);

    // Base Deno container
    const base: Container = dag
      .container()
      .from(`denoland/deno:latest`)
      // Mount the entire module source (including app.ts) to /app
      .withDirectory("/app", moduleSource)
      .withWorkdir("/app");

    // Container configured to run the app with native OTEL
    const runner: Container = base
      .withEnvVariable("OTEL_DENO", "true") // Enable Deno native OTEL
      .withEnvVariable("OTEL_SERVICE_NAME", serviceName).terminal() // Set OTEL service name
      // Dagger automatically injects OTEL_EXPORTER_OTLP_ENDPOINT into withExec
      // Add any other OTEL_ env vars here if needed (e.g., OTEL_RESOURCE_ATTRIBUTES)

      .withExec([
        "deno",
        "run",
        "--unstable-otel", // <-- Enable native OTEL features
        // Permissions needed by app.ts:
        "--allow-net", // For fetch() and runtime's OTLP exporter
        "--allow-env", // To read OTEL_* environment variables
        "--allow-read", // To read app.ts source file
        // Path to app.ts inside the container:
        "app.ts",
      ]);

    // Execute and return stdout
    console.log("Executing Deno script via Dagger Module...");
    const output = await runner.stdout();
    console.log("Deno script finished executing.");
    return output;
  }

  /**
   * Example of just returning the base container for further chaining.
   */
  @func()
  baseContainer(denoVersion: string = "2.2.8"): Container {
    // Get the module source directory, which includes app.ts
    const moduleSource: Directory = dag.currentModule().source();

    return dag
      .container()
      .from(`denoland/deno:bin-${denoVersion}`)
      .withDirectory("/app", moduleSource) // Mount source code
      .withWorkdir("/app");
  }
}
