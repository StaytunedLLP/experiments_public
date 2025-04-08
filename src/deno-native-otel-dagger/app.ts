// app.ts
// Import only the API package - Deno runtime provides the implementation
import { SpanStatusCode, trace } from "npm:@opentelemetry/api@1"; // Use v1 as recommended

// Optional: Define tracer name and version based on your app/library
const tracer = trace.getTracer("my-deno-app", "0.2.0");

async function doWork() {
  // Start a custom span using the standard API
  await tracer.startActiveSpan("doWork-custom-span", async (span) => {
    console.log("Inside doWork custom span...");
    span.setAttribute("app.runtime", "deno-native-otel");
    span.setAttribute("deno.version", Deno.version.deno);

    try {
      // This fetch call will be AUTO-INSTRUMENTED by Deno's native OTEL
      span.addEvent("Fetching data from example.com (auto-instrumented)");
      console.log("Making fetch request...");
      const response = await fetch("https://example.com");
      // The runtime adds attributes like http.status_code automatically to its fetch span
      const text = await response.text();
      console.log(`Fetched ${text.length} bytes from example.com`);
      span.addEvent("Data fetched successfully");

      // Add custom attributes to our *custom* span
      span.setAttribute("fetch.response_length", text.length);

      // Simulate another sub-task within our custom span
      await tracer.startActiveSpan("sub-task-custom", async (subSpan) => {
        console.log("Inside sub-task custom span...");
        await new Promise((resolve) => setTimeout(resolve, 50));
        subSpan.setAttribute("subtask.duration_ms", 50);
        console.log("Sub-task finished.");
        subSpan.end(); // Remember to end spans!
      });

      span.setStatus({ code: SpanStatusCode.OK });
      console.log("doWork custom span finished successfully.");
    } catch (error) {
      console.error("Error during doWork:", error);
      // Record exception on our custom span
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      console.log("doWork custom span finished with error.");
    } finally {
      // End the main custom span
      span.end();
    }
  });
}

async function main() {
  // No OTEL setup needed here - Deno runtime handles it!
  console.log("Starting application work (with Deno native OTEL)...");
  console.log(`Deno version: ${Deno.version.deno}`);
  console.log(`OTEL_DENO env var: ${Deno.env.get("OTEL_DENO")}`);
  console.log(
    `OTEL_SERVICE_NAME env var: ${Deno.env.get("OTEL_SERVICE_NAME")}`,
  );
  console.log(
    `OTEL_EXPORTER_OTLP_ENDPOINT env var: ${
      Deno.env.get("OTEL_EXPORTER_OTLP_ENDPOINT")
    }`,
  ); // Dagger injects this

  await doWork();

  // Console logs below might also be captured as OTEL logs by the runtime
  console.log("Application work finished.");
  console.log("Deno runtime will handle OTEL shutdown implicitly on exit.");
  // No explicit provider.shutdown() needed
}

// Run the main function
main().catch((e) => {
  console.error("Unhandled error in main:", e);
  Deno.exit(1);
});
