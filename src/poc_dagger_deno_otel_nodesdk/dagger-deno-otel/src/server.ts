// src/server.ts
console.log("Starting Deno OTel Demo Server...");

// Check if OTLP endpoint is configured (for debugging)
const otlpEndpoint = Deno.env.get("DENO_OTEL_LOG_EXPORTER_OTLP_ENDPOINT");
if (otlpEndpoint) {
    console.log(`Deno configured to send OTLP logs to: ${otlpEndpoint}`);
    console.log(`Deno Service Name: ${Deno.env.get("DENO_OTEL_SERVICE_NAME")}`);
} else {
    console.warn(
        "DENO_OTEL_LOG_EXPORTER_OTLP_ENDPOINT not set. Logs will only go to console.",
    );
}

Deno.serve({ port: 8080 }, (req: Request) => {
    const url = new URL(req.url);
    const clientIp = req.headers.get("x-forwarded-for") || "unknown"; // Example header

    // These console logs will be captured by Deno's OTel exporter if configured
    console.log(
        `[INFO] Received request: ${req.method} ${url.pathname} from ${clientIp}`,
    );

    // Example of structured logging (often better)
    console.log(JSON.stringify({
        level: "INFO",
        message: "Processing request",
        path: url.pathname,
        method: req.method,
        timestamp: new Date().toISOString(),
    }));

    // Example error log
    if (url.pathname === "/error") {
        console.error("[ERROR] Simulating an error for path /error");
        return new Response("Simulated error!", { status: 500 });
    }

    return new Response(
        `Hello from Deno in Dagger! You requested: ${url.pathname}`,
    );
});

console.log("Deno server listening on http://localhost:8080");
