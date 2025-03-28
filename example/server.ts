console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, (_req) => new Response("Hello, world"));
