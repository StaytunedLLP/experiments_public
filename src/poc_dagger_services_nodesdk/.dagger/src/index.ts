import { dag, func, object, Service } from "@dagger.io/dagger";

@object()
export class PocServices {
  /**
   * Start and return an HTTP service
   */
  @func()
  httpService(): Service {
    return dag
      .container()
      .from("python")
      .withWorkdir("/srv")
      .withNewFile("index.html", "Hello, world!")
      .withExposedPort(8080)
      .asService({ args: ["python", "-m", "http.server", "8080"] });
  }

  /**
   * Starts a Deno "Hello, world" HTTP service.
   * Listens on port 8000 internally and exposes it.
   * Example: dagger call deno-http-service --up
   */
  @func()
  denoHttpService(): Service {
    const internalPort = 8000;
    const denoVersion = "1.42.1";

    return dag
      .container()
      .from(`denoland/deno:${denoVersion}`) // Use pinned version
      .withWorkdir("/srv")
      .withNewFile(
        "main.ts",
        // Use the internalPort variable in the script
        `console.log("Deno server starting on port ${internalPort}...");\n` +
          `Deno.serve({ port: ${internalPort} }, (_req) => new Response("Hello, world from Deno!"));\n` +
          `console.log("Deno server listening on port ${internalPort}.");`,
      )
      .withExposedPort(8001)
      .withExec([
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "--allow-env",
        "main.ts",
      ])
      .asService();
  }

  /**
   * Starts a Node.js "Hello, world" HTTP service.
   * Listens on port 3000 internally and exposes it.
   * Example: dagger call node-test-http-service --up
   */
  @func()
  nodeTestHttpService(): Service {
    const internalPort = 3000;
    const nodeVersion = "node:20-alpine";
    const serverScript = `
const http = require('node:http');
const port = ${internalPort}; // Use the variable

console.log('[Node Server] Script starting...');

try {
  const server = http.createServer((req, res) => {
    console.log(\`[Node Server] Received request: \${req.method} \${req.url}\`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('hello from Node!\\n'); // Use escaped newline
    res.end();
  });

  server.on('error', (err) => {
    console.error('[Node Server] Server error:', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(\`[Node Server] Successfully listening on internal port \${port}\`);
  });

  console.log('[Node Server] Attempted to start listening...');

} catch (err) {
  console.error('[Node Server] Error during script setup:', err);
  process.exit(1);
}
`; // End of serverScript

    return dag
      .container()
      .from(nodeVersion)
      .withWorkdir("/srv")
      .withNewFile("server.js", serverScript)
      // *** Crucial: Expose the SAME port the server listens on ***
      .withExposedPort(internalPort)
      .withExec(["node", "server.js"])
      // *** Simplest way when using withExec: No args needed for asService ***
      .asService();
  }
}
