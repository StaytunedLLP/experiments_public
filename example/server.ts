console.log("Deno HTTP server starting on http://localhost:8000/");

// Deno.serve automatically instruments requests when OTel env vars are set.
Deno.serve({ port: 8000 }, (req: Request) => {
  const url = new URL(req.url);
  console.log(`Received request: ${req.method} ${url.pathname}`);

  if (url.pathname === "/") {
    return new Response("Hello World from Deno Native OTel!", { status: 200 });
  } else {
    return new Response("Not Found", { status: 404 });
  }
});
