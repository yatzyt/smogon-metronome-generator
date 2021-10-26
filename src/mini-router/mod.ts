import { NotFoundHandler } from "./http-errors.ts";

export interface Router {
    route(req: Request): RouteHandler;
}

export interface RouteHandler {
    handle(req: Request): Promise<Response>;
}

export interface Route {
    match(req: Request): RouteHandler | null;
}

export class BasicRouter {
    public routes: Route[];

    constructor(routes: Route[]) {
        this.routes = routes;
    }

    public async handle(req: Request): Promise<Response> {
        try {
            const handler = this.route(req);
            return handler.handle(req);
        } catch (e) {
            console.error(e);
            return new Response(undefined, {
                status: 500,
                statusText: `Internal server error: ${e.message}`,
            });
        }
    }

    public route(req: Request): RouteHandler {
        const handler = this.match(req);
        if (handler) {
            return handler;
        }
        return new NotFoundHandler();
    }

    public match(req: Request): RouteHandler | null {
        // TODO improve efficiency?
        for (const route of this.routes) {
            const handler = route.match(req);
            if (handler != null) {
                return handler;
            }
        }
        return null;
    }
}