

import sharedConfigIntro from "@repo/_shared/domain_one/fresh.config.ts"
import sharedManifestIntro from "@repo/_shared/domain_one/fresh.gen.ts"
import { createHandler, type ServeHandlerInfo } from "$fresh/server.ts";


const handlerIntroDomain = createHandler(
    { ...sharedManifestIntro },
    { ...sharedConfigIntro },
);

//#region Handler Definitions

const productionHandlers = {
    "intro.staytuned.website": handlerIntroDomain,
    // "docs.staytuned.website": handlerDomain2Domain,
};

// "blog.staytuned.website": handlerBlogDomain,
const developmentHandlers = {
    "localhost": handlerIntroDomain,
    // "docs.localhost": handlerDomain2Domain,
};
// "api.localhost": handlerApiDomain,

// #endregion

//#region Handler Assignment

interface Handlers {
    [key: string]: Promise<
        (req: Request, connInfo?: ServeHandlerInfo) => Promise<Response>
    >;
}

/**
 * Handlers for different domains.
 * Each handler is responsible for serving requests for a specific domain.
 */
const handlers: Handlers = developmentHandlers;

//#endregion

/**
 * Retrieves the appropriate handler based on the URL hostname.
 *
 * @param {URL} url - The URL of the incoming request.
 * @returns {Function} - The handler function for the corresponding domain.
 */
const getHandler = (url: URL) => handlers[url.hostname];

/**
 * Cache instances for blog domain.
 * These caches are used to store and retrieve cached responses.
 */
// export const cacheBlogDomain = await openCache("blogDomainCache");

//#region CORS Handler
/**
 * Handles CORS (Cross-Origin Resource Sharing) requests.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Response | null} - A response object with CORS headers if the request method is OPTIONS, otherwise null.
 */
const handleCors = (req: Request): Response | null => {
    const origin = req.headers.get("Origin");

    if (req.method === "OPTIONS") {
        const headers = new Headers();
        // setCorsHeaders(headers, origin);
        return new Response(null, {
            status: 204,
            headers,
        });
    }
    return null;
};
//#endregion

//#region Response Handler
/**
 * Adds CORS headers to the response.
 *
 * @param {Response} response - The response object to which CORS headers will be added.
 * @param {string | null} origin - The origin of the request.
 * @returns {Response} - The response object with added CORS headers.
 */
const addCorsHeaders = (
    response: Response,
    origin: string | null,
): Response => {
    const headers = new Headers(response.headers);
    // setCorsHeaders(headers, origin);

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};
//#endregion

//#region Server
/**
 * Starts the Deno server and handles incoming requests.
 *
 * @param {Object} options - The server options.
 * @param {number} options.port - The port number on which the server will listen.
 * @param {Function} handler - The request handler function.
 */
Deno.serve({ port: 5000 }, async (req, info) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const handler = await getHandler(url);
    const origin = req.headers.get("Origin");

    const response = await handler(req, info);
    return addCorsHeaders(response, origin);
});
//#endregion
