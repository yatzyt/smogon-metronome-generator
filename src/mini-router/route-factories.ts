import { Route, RouteHandler } from "./mod.ts";
import { MethodNotAllowedHandler } from "./http-errors.ts";
import { pathToRegexp } from "../../deps.ts";

export function get(pattern: string, handler: RouteHandler): Route {
    const regexp = pathToRegexp(pattern);
    return new class GetRoute implements Route {
        public match(req: Request): RouteHandler | null {
            const url = new URL(req.url);
            if (req.method !== 'GET') {
                return new MethodNotAllowedHandler();
            }
            const parse = regexp.exec(url.pathname);
            if (parse) {
                return handler;
            }
            return null;
        }
    };
}