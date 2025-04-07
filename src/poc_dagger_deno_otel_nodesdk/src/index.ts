/**
 * A generated module for PocDaggerDenoOtelNodesdk functions
 *
 * This module demonstrates various Dagger patterns, including running services,
 * handling directories, and basic container operations.
 * It includes examples for Deno and Node.js services, with considerations
 * for OpenTelemetry integration with Dagger Cloud.
 */
import {
  Container,
  dag,
  Directory,
  func,
  object,
  Service,
} from "@dagger.io/dagger";

@object()
export class PocDaggerDenoOtelNodesdk {
  /**
   * Returns a container that echoes whatever string argument is provided.
   * Example: dagger call container-echo --string-arg "hello world" stdout
   */
  @func()
  containerEcho(): Container {
    return dag.container().from("alpine:latest").withExec([
      "echo",
      "hello world",
    ]);
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
    const internalPort = 4318; // Port the Deno app should listen on

    console.log(
      `Configuring Deno ${denoVersion} container to listen on port ${internalPort}.`,
    );

    let container = dag
      .container()
      .from(`denoland/deno:${denoVersion}`)
      .withDirectory("/app", src)
      .withWorkdir("/app")
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
        "--allow-net", // Needed for server and potentially OTLP export
        "--allow-env=OTEL_EXPORTER_OTLP_ENDPOINT,OTEL_SERVICE_NAME", // Allow reading specific OTel vars
        "server.ts", // Ensure this file exists in the 'src' Directory and listens on internalPort
      ]);

    console.log(
      `Container configured to run 'server.ts'. OTLP export will activate if OTEL_EXPORTER_OTLP_ENDPOINT is set in the container's environment.`,
    );

    return container;
  }

  /**
   * Creates and runs an ephemeral Deno "Hello World" service on port 4318.
   * Example: dagger call start-deno-hello-service --up
   */
  @func()
  startDenoHelloService(): Service { // Renamed from startOtelServer for clarity
    const internalPort = 4318; // Define port once
    const denoVersion = "1.42.1"; // Pinned version

    // 1. Create a directory containing the main.ts file
    const srcDir: Directory = dag
      .directory()
      .withNewFile("main.ts", this.denoHelloCode(internalPort)); // Pass port to generator

    // 2. Define the Deno container
    const denoContainer: Container = dag
      .container()
      .from(`denoland/deno:${denoVersion}`)
      .withDirectory("/app", srcDir)
      .withWorkdir("/app")
      .withExposedPort(internalPort) // Expose the same port
      .withExec(["deno", "run", "--allow-net", "main.ts"]);

    // 3. Return the container as a service
    console.log(
      `Deno 'Hello World' service defined on port ${internalPort}. Run with 'dagger call start-deno-hello-service --up'`,
    );
    return denoContainer.asService();
  }

  /**
   * Generates the Deno "Hello World" server code for a specific port.
   */
  private denoHelloCode(port: number): string { // Renamed from denoCode
    // Using a slightly more recent std version, ensure it's compatible if you change Deno version
    return `
        import { serve } from "https://deno.land/std@0.220.0/http/server.ts";

        // Use the port variable passed to the function
        const listenPort = ${port};
        console.log(\`Deno HTTP webserver running inside container. Listening on http://localhost:\${listenPort}/\`);

        serve((_request: Request) => {
            console.log("Request received inside Deno container!");
            return new Response("Hello world from Deno!", {
                status: 200,
                headers: { "content-type": "text/plain" },
            });
        }, {
           port: listenPort,
           onListen: ({ hostname, port }) => console.log(\`Server ready at http://\${hostname}:\${port}/\`)
        });
        `;
  }

  /**
   * Creates and runs an ephemeral Node.js "Hello World" service on port 4318.
   * Example: dagger call start-node-hello-service --up
   */
  @func()
  startNodeHelloService(): Service { // Renamed from startNodeServer
    const internalPort = 4318; // Define port once
    const nodeVersion = "lts-alpine"; // Pinned version (LTS Alpine)

    // Define the Node.js server code using the correct port
    const nodeCode = `
const http = require('http');
const port = ${internalPort}; // Use the variable

const server = http.createServer((req, res) => {
  console.log('Request received inside Node.js container!');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world from Node.js Dagger Module!');
});

server.listen(port, () => {
  console.log(\`Node.js HTTP server running inside container. Listening on port \${port}\`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
`;

    const srcDir: Directory = dag
      .directory()
      .withNewFile("server.js", nodeCode);

    const nodeContainer: Container = dag
      .container()
      .from(`node:${nodeVersion}`)
      .withDirectory("/app", srcDir)
      .withWorkdir("/app")
      .withExposedPort(internalPort) // Expose the same port
      .withExec(["node", "server.js"]);

    console.log(
      `Node.js 'Hello World' service defined on port ${internalPort}. Run with 'dagger call start-node-hello-service --up'`,
    );
    return nodeContainer.asService();
  }
}
