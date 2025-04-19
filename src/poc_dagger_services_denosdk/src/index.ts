import {
  dag,
  Directory,
  func,
  object,
  type Service,
} from "@dagger.io/dagger";
import { getTracer } from "../sdk/src/telemetry/telemetry.ts";

@object()
export class Test {

  @func()
  async foo(source: Directory): Promise<Service> {
    const tracer = getTracer()
    const service = await this.serve(source);
    await tracer.startActiveSpan("example", async () => {
      service.
    })
    return service;
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
}
