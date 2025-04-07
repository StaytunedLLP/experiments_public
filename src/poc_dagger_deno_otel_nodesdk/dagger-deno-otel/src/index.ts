// src/index.ts
import {
    Container,
    dag,
    Directory,
    env,
    func,
    object,
} from "@dagger.io/dagger";

@object()
class DenoOtelExample {
    /**
     * Runs a simple Deno HTTP server configured for OTel logging.
     * @param src Directory containing the Deno server source code (e.g., server.ts)
     */
    @func()
    async runDenoServer(src: Directory): Promise<void> {
        // Dagger automatically injects OTEL_* environment variables into the function's context
        // when connected to Dagger Cloud. We need to retrieve the OTLP endpoint Dagger provides.
        const otelEndpoint = env.get("OTEL_EXPORTER_OTLP_ENDPOINT");

        if (!otelEndpoint) {
            console.error(
                "WARN: OTEL_EXPORTER_OTLP_ENDPOINT is not set. Is Dagger connected to Cloud/an OTel collector? Logs won't be exported via OTLP.",
            );
            // Optionally proceed without OTLP export for local testing:
            // await this.denoContainer(src).sync()
            // return
            // Or throw an error:
            throw new Error(
                "OTEL_EXPORTER_OTLP_ENDPOINT environment variable is required for OTLP export.",
            );
        }

        console.log(
            `Using Dagger's OTLP Endpoint for Deno logs: ${otelEndpoint}`,
        );

        await this.denoContainer(src, otelEndpoint).withExposedPort(8000)
            .asService();
        // Ensure the container runs the server. sync() executes the default command or withExec.
        // .sync()
    }

    /**
     * Helper function to create the configured Deno container.
     */
    private denoContainer(src: Directory, otelEndpoint?: string): Container {
        let container = dag
            .container()
            .from("denoland/deno:1.42.1") // Use a specific Deno version
            .withDirectory("/app", src)
            .withWorkdir("/app")
            .withExposedPort(8080); // Expose the port Deno listens on

        // If an OTLP endpoint is available, configure Deno's native OTel log exporter
        if (otelEndpoint) {
            container = container
                // Set environment variables for Deno's OTLP Log Exporter:
                // 1. DENO_OTEL_SERVICE_NAME: Identifies your service in telemetry systems.
                .withEnvVariable(
                    "DENO_OTEL_SERVICE_NAME",
                    "deno-server-in-dagger",
                )
                // 2. DENO_OTEL_LOG_EXPORTER_OTLP_ENDPOINT: Tell Deno where to send logs.
                //    Use the endpoint provided by Dagger's environment.
                .withEnvVariable(
                    "DENO_OTEL_LOG_EXPORTER_OTLP_ENDPOINT",
                    otelEndpoint,
                )
                // 3. DENO_OTEL_LOG_EXPORTER_OTLP_PROTOCOL: Specify the OTLP protocol.
                //    Dagger Cloud typically expects http/protobuf.
                .withEnvVariable(
                    "DENO_OTEL_LOG_EXPORTER_OTLP_PROTOCOL",
                    "http/protobuf",
                );
            // 4. Dagger injects TRACEPARENT automatically - Deno might pick this up for correlating logs and traces.
        }

        // Define the command to run the Deno server.
        // --allow-net is required for serving HTTP and sending OTLP data.
        // --allow-env is required for Deno to read the DENO_OTEL_* variables.
        container = container.withExec([
            "deno",
            "run",
            "--allow-net",
            "--allow-env",
            "server.ts",
        ]);

        return container;
    }

    // Define the Deno server code

    /**
     * Example function to test the server by sending a request (optional)
     * Note: This requires the server to be running, potentially as a service.
     * For simplicity, we focus on just running the server and checking logs first.
     */
    // @func()
    // async testServer(src: Directory): Promise<string> {
    //   const otelEndpoint = await env("OTEL_EXPORTER_OTLP_ENDPOINT")?.value()
    //   const denoService = this.denoContainer(src, otelEndpoint).asService()

    //   // Example of sending a request to the service
    //   return dag.container().from("alpine/curl")
    //     .withServiceBinding("deno-app", denoService) // Bind the service
    //     .withExec(["curl", "http://deno-app:8080/test"])
    //     .stdout()
    // }
}
