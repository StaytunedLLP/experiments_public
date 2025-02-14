Deno.serve({ port: 4318 }, async (req) => {
    // the request will have the traces in json format og that here
    const otelData = await req.json();
    console.log(otelData);

    return new Response(JSON.stringify({ status: "success", data: otelData }), {
        status: 200,
    });
});
