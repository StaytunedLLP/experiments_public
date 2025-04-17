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
      .from(`denoland/deno:latest`) // Use pinned version
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
    src: Directory
  ): Service {
    const DENO_VERSION = Deno.env.get("DENO_VERSION") || "2.2.10"; // Or your preferred version
    const APP_PORT = parseInt(Deno.env.get("APP_PORT") || "8000");
    // 1. Define the base container with mounts, env vars, and EXPOSED PORT
    const baseContainer = dag
      .container()
      .from(`denoland/deno:${DENO_VERSION}`) // Use specific version
      .withMountedDirectory("/app", src)         // Mount for hot-reload
      .withWorkdir("/app")                     // Set context
      .withEnvVariable("PORT", String(APP_PORT)) // Pass port to your app
      .withExposedPort(APP_PORT);                // <<< DECLARE port for tunneling

    // 2. Define the EXACT command to run using withExec
    const executingContainer = baseContainer.withExec([
      "deno",
      "run",
      "--allow-net",
      "--allow-read",
      "--allow-env",
      "--watch", // <<< Deno's watcher will run correctly here
      "main.ts",
    ]);

    // 3. Convert to a service. Dagger runs the withExec command AND sets up the tunnel
    return executingContainer.asService(); // <<< Tunneling happens when this service runs
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


  @func()
  serve(
    /**
     * Source directory containing the Deno app (e.g., main.ts)
     * Mounts the project root by default.
     */
    source: Directory,
    /**
     * Deno version tag (e.g., "latest", "1.40.0")
     */
    denoVersion: string = "latest",
    /**
     * Port your Deno application listens on internally
     */
    appPort: number = 8000,
  ): Service {

    // Use the official Deno image
    const denoImage = `denoland/deno:${denoVersion}`
    console.log(`Using Deno image: ${denoImage}`)
    console.log(`Application port: ${appPort}`)

    // Deno requires net and read permissions. --watch enables hot reload.
    const command = [
      "deno",
      "run",
      "--watch",        // Enable Deno's file watcher and restart on change
      "--allow-net",    // Allow network access for the server
      "--allow-read",   // Allow reading files (needed for --watch)
      "main.ts"         // Your main application file
    ]
    console.log(`Executing command: ${command.join(" ")}`)

    return dag
      .container()
      .from(denoImage)
      // Mount the *entire* source directory (project root) to /app
      // This is crucial for --watch to detect changes
      .withMountedDirectory("/app", source)
      // Set the working directory inside the container
      .withWorkdir("/app")
      // Expose the port Deno.serve is listening on
      .withExposedPort(appPort)
      // Define the command to run the Deno server with --watch
      .withDefaultArgs(command)
      // Convert the container setup to a runnable service
      .asService({ useEntrypoint: true })
  }

  @func()
  watch(
    source: Directory,
    denoVersion: string = "latest",
    appPort: number = 8000,
  ): Service {
    const imageName = `denoland/deno:${denoVersion}`
    const workDir = "/app"
    // Define the entrypoint executable
    const entrypointCmd = ["deno"]
    // Define the default arguments for the entrypoint
    const defaultArgs = ["run", "--watch", "-A", "main.ts"] // Corresponds to CMD

    console.log(`Using Deno image: ${imageName}`)
    console.log(`Internal app port: ${appPort}`)
    console.log(`Working directory: ${workDir}`)
    console.log(`Entrypoint: ${entrypointCmd.join(" ")}`)
    console.log(`Default Args: ${defaultArgs.join(" ")}`)

    return (
      dag
        .container()
        .from(imageName)
        .withMountedDirectory(workDir, source)
        .withWorkdir(workDir)
        .withExposedPort(appPort)
        // ---- Use withEntrypoint and withDefaultArgs ----
        .withEntrypoint(entrypointCmd) // Sets ENTRYPOINT
        .withDefaultArgs(defaultArgs) // Sets CMD (arguments for ENTRYPOINT)
        // ---------------------------------------------
        .asService()
    )
  }
}
