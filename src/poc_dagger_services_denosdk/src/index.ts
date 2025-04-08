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
import {
  Container,
  dag,
  Directory,
  func,
  object,
  type Service,
} from "@dagger.io/dagger";

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

  @func()
  denoHttpService(): Service {
    const internalPort = 4318; // Port for the Deno server
    const denoVersion = "1.42.1";
    return dag
      .container()
      .from(`denoland/deno:${denoVersion}`) // Use pinned version
      .withWorkdir("/srv")
      .withNewFile(
        "main.ts",
        `console.log("Deno server starting on port ${internalPort}...");\n` +
          `Deno.serve({ port: 4318 }, async (req) => {\n` +
          `  console.log("Request", req);\n` +
          `  return new Response(JSON.stringify({ status: "success" }), {\n` +
          `    status: 200,\n` +
          `  });\n` +
          `});\n`,
      )
      .withExposedPort(4318)
      .asService({
        useEntrypoint: true,
        args: [
          "deno",
          "run",
          "--allow-net",
          "--allow-read",
          "--allow-env",
          "main.ts",
        ],
      });
  }

  /**
   * Returns a Deno service container configured for optional OTel logging.
   * Assumes 'server.ts' exists in the source directory and listens on port 8080.
   * Dagger Cloud automatically injects OTel env vars into the container.
   * Example: dagger call run-deno-service --src . --up
   *
   * @param src Directory containing the Deno server source code (e.g., server.ts)
   */
  @func()
  runDenoService( // Renamed from runDenoServer for consistency
    src: Directory = dag.currentModule().source().directory("."),
  ): Service {
    // Define the container using the helper
    const container = this.denoContainer(src);

    // Return as a service - Dagger will start it when called with --up
    console.log(
      "Deno service defined. Run with 'dagger call run-deno-service --src <dir> --up'",
    );
    return container.asService();
  }

  /**
   * Helper function to create the configured Deno container.
   * Reads OTel endpoint from container's env (set by Dagger Cloud or manually).
   * Assumes the server script is named 'server.ts' and listens on port 8080.
   */
  private denoContainer(src: Directory): Container {
    // Base container setup
    const denoVersion = "1.42.1"; // Pinned version
    const internalPort = 8000; // Port the Deno app should listen on

    console.log(
      `Configuring Deno ${denoVersion} container to listen on port ${internalPort}.`,
    );

    let container = dag
      .container()
      .from(`denoland/deno:${denoVersion}`)
      .withDirectory("/app", src)
      .withWorkdir("/app")
      .withEnvVariable("DENO_DEPLOYMENT_ID", "dagger-run")
      .withEnvVariable("OTEL_SERVICE_NAME", "deno-native-http-server")
      .withExposedPort(internalPort); // Expose the port Deno listens on

    // Command that runs regardless of OTel.
    // Deno's native OTel support reads env vars like
    // OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME etc. automatically if set.
    // Dagger Cloud will set these automatically in the container's env.
    container = container
      .withEnvVariable("DENO_OTEL_SERVICE_NAME", "deno-otel-service") // Optional: Set a service name
      // Deno needs permission to read env vars and use the network for OTLP export and serving
      .withExec([
        "deno",
        "run",
        "--allow-net=0.0.0.0:8000", // Allow listening on the specified port
        "--allow-env=OTEL_EXPORTER_OTLP_ENDPOINT,OTEL_SERVICE_NAME", // Allow reading specific OTel vars
        "main.ts", // Ensure this file exists in the 'src' Directory and listens on internalPort
      ]);

    console.log(
      `Container configured to run 'server.ts'. OTLP export will activate if OTEL_EXPORTER_OTLP_ENDPOINT is set in the container's environment.`,
    );

    return container;
  }

  /** Deno version to use */
  // denoVersion: string = "1.42.1"; // Or your preferred recent version

  /** Base Deno container */
  baseContainer(): Container {
    return dag.container().from(`denoland/deno:latest`)
      .withMountedCache("/deno-dir", dag.cacheVolume("deno-cache-native-poc"))
      .withEnvVariable("DENO_DIR", "/deno-dir");
  }

  /**
   * Runs the simple Deno HTTP server (server.ts) using Deno's native OTel instrumentation.
   * Traces for HTTP requests will be sent via Dagger to the configured OTLP endpoint.
   * @param appSource The directory containing server.ts and deno.json. Defaults to host CWD.
   */
  @func()
  runNativeServer(
    appSource: Directory,
  ): Service { // Return a Service to keep the server running
    // Environment variables to activate Deno's native OTel export
    const otelEnv = {
      // Crucial: Tells Deno to enable native OTel export
      "DENO_DEPLOYMENT_ID": "dagger-run", // Value can be anything non-empty
      // Standard OTel vars (Dagger injects OTEL_EXPORTER_OTLP_ENDPOINT)
      "OTEL_SERVICE_NAME": "deno-native-http-server",
      // Optional: Adjust log/trace levels if needed
      // "OTEL_LOG_LEVEL": "debug",
      // "OTEL_TRACES_EXPORTER": "otlp", // Default is otlp
    };

    const serveCmd = [
      "sh", // Use shell to run multiple commands
      "-c",
      "deno",
      "run",
      "--allow-env", // Needed for OTEL_*, DENO_* vars
      "--allow-net=0.0.0.0:8000", // Allow listening on the specified port
      // No --allow-read needed unless server.ts reads files
      // No unstable flags needed specifically for Deno.serve OTel
      `echo "--- ENV VARS INSIDE CONTAINER ---" && \
       env | grep -E 'DENO_|OTEL_' && \
       echo "--- STARTING SERVER ---" && \
       deno run --allow-env --allow-net=0.0.0.0:8000 server.ts`,
    ];

    return this.baseContainer()
      .withDirectory("/app", appSource, {
        exclude: ["node_modules", ".git", "dagger.gen.ts", ".vscode"],
      })
      .withWorkdir("/app")
      // Set the OTel environment variables
      .withEnvVariable("DENO_DEPLOYMENT_ID", otelEnv.DENO_DEPLOYMENT_ID)
      .withEnvVariable("OTEL_SERVICE_NAME", otelEnv.OTEL_SERVICE_NAME)
      // Expose the server port
      .withExposedPort(8000)
      // .withExec(serveCmd)
      // Return as a Service to keep the container running
      .asService({ args: serveCmd, useEntrypoint: true });
  }

  // --- Keep the runAppWithTrace function from before if you still need it ---
  /**
   * Runs the manually instrumented main.ts application.
   * @param appSource The directory containing the application source code. Defaults to host CWD.
   */
  @func()
  async runAppWithTrace(
    appSource: Directory,
  ): Promise<string> {
    // ... (implementation from previous step remains unchanged) ...
    const execCmd = [
      "deno",
      "run",
      "--allow-env",
      "--allow-net",
      "--allow-read=.",
      "--unstable-otel",
      "--unstable-kv",
      "--unstable-bare-node-builtins",
      "--unstable-sloppy-imports",
      "--unstable-node-globals",
      "--unstable-byonm",
      "main.ts",
    ];
    return this.baseContainer()
      .withDirectory("/app", appSource, {
        exclude: ["node_modules", ".git", "dagger.gen.ts", ".vscode"],
      })
      .withWorkdir("/app")
      .withExec(execCmd)
      .stdout();
  }
}
