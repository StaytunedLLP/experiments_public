import { dag, func, object, Service } from "@dagger.io/dagger";

@object()
export class MyModule {
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
   * Start and return an HTTP service
   */
  @func()
  denoHttpService(): Service {
    return dag
      .container()
      .from("denoland/deno")
      .withWorkdir("/srv")
      .withNewFile(
        "main.ts",
        `Deno.serve({ port: 8000 }, (_req) => new Response("Hello, world"));`,
      )
      .withExposedPort(4813)
      .withExec(["deno", "run", "--allow-all", "main.ts"])
      .asService({ useEntrypoint: true }); // tried with useEntrypoint: false also but getitng same issue
  }

  @func()
  nodeTestHttpService(): Service {
    // Define the port consistently
    const internalPort = 3000;

    // Use a specific Node.js version (e.g., LTS Alpine for smaller size)
    const nodeVersion = "node:20-alpine";

    // Prepare the server script with logging and error handling
    const serverScript = `
const http = require('node:http');
const port = ${internalPort};

console.log('[Node Server] Script starting...');

try {
  const server = http.createServer((req, res) => {
    console.log(\`[Node Server] Received request: \${req.method} \${req.url}\`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('hello\\n'); // Ensure newline is escaped correctly in template literal
    res.end();
  });

  server.on('error', (err) => {
    // Log server errors (e.g., address already in use)
    console.error('[Node Server] Server error:', err);
    process.exit(1); // Exit if the server encounters a fatal error
  });

  server.listen(port, () => {
    // This confirms the server *successfully* started listening
    console.log(\`[Node Server] Successfully listening on port \${port}\`);
  });

  console.log('[Node Server] Attempted to start listening...');

} catch (err) {
  console.error('[Node Server] Error during script setup:', err);
  process.exit(1); // Exit if setup fails
}
`; // End of serverScript

    return dag
      .container()
      .from(nodeVersion) // Use specific version
      .withWorkdir("/srv")
      .withNewFile("server.js", serverScript)
      .withExposedPort(3001)
      .withExec(["node", "server.js"])
      .asService({ useEntrypoint: true }); // tried with useEntrypoint: false also but getitng same issue
  }
}
