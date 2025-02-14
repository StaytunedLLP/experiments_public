/*app.ts*/
const PORT: number = 8800;
import { type Span, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("dice-lib");

const rollOnce = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const rollTheDice = (rolls: number, min: number, max: number): number[] =>
  tracer.startActiveSpan("rollTheDice", (span: Span) => {
    const result: number[] = [];
    span.setAttribute("rolls", rolls);
    for (let i = 0; i < rolls; i++) {
      result.push(rollOnce(min, max));
    }
    span.end();
    return result;
  });

const handler = async (req: Request): Promise<Response> => {
  const pathname = new URL(req.url).pathname;
  if (pathname === "/") {
    const rolls = rollOnce(1, 10);
    console.log("Got request for ", rolls);
    return new Response(JSON.stringify(rollTheDice(rolls, 1, 10)));
  }
  return new Response("Not found", { status: 404 });
};

Deno.serve({ port: PORT }, handler);