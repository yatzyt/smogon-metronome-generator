import { RouteHandler } from "./mod.ts";

export class NotFoundHandler implements RouteHandler {
    public async handle(req: Request): Promise<Response> {
        return new Response(undefined, {
            status: 404,
            statusText: "Not found.",
        });
    }
}

export class MethodNotAllowedHandler implements RouteHandler {
    public async handle(req: Request): Promise<Response> {
        return new Response(undefined, {
            status: 405,
            statusText: "Method not allowed.",
        })
    }
}