Deno.serve({ port: 8000 }, async (req) => {
  console.log("Request", req);
  return new Response(JSON.stringify({ status: "succesddadfdfs!" }), {
    status: 200,
  });
});