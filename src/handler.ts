import { RouteHandler, BasicRouter } from "./mini-router/mod.ts";
import { get } from "./mini-router/route-factories.ts";
import { React, ReactDOMServer, virtualSheet, twSetup, getStyleTag } from "../deps.ts";
import { ClientBundleGenerator } from "./types.ts";
import { randomizePokemon } from "./pokemon/mod.ts";

import App from "./client/app.tsx";
import { Parameters } from "./client/styling.ts";

const sheet = virtualSheet();
twSetup({ sheet, ...Parameters });

class IndexHandler implements RouteHandler {
    public async handle(_req: Request): Promise<Response> {
        (sheet as any).reset();
        const pkmn = [randomizePokemon(), randomizePokemon()];
        const reactCode = ReactDOMServer.renderToString(React.createElement(App, {pkmn}));
        const styleTag = getStyleTag(sheet);
        const body = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${styleTag}
                <title>Smogon Metronome Generator</title>
                <script src="https://kit.fontawesome.com/02c0f4d516.js" crossorigin="anonymous"></script>
                <script>
                    window.initialPokes = ${JSON.stringify(pkmn)};
                </script>
            </head>
            <body>
                <main>${reactCode}</main>
                <script type="module" src="/static/client.js" async defer></script>
            </body>
        </html>
        `;
        const headers = new Headers([
            ['Content-Type', 'text/html'],
        ]);
        return new Response(body, { headers });
    }
}

class ClientJsHandler implements RouteHandler {
    private gen: ClientBundleGenerator;

    constructor(gen: ClientBundleGenerator) {
        this.gen = gen;
    }

    public async handle(_req: Request): Promise<Response> {
        const body = await this.gen.getBundle();
        const headers = new Headers([
            ['Content-Type', 'text/javascript'],
        ]);
        return new Response(body, { headers });
    }
}

function handleRequest(req: Request, gen: ClientBundleGenerator): Promise<Response> {
    const router = new BasicRouter([
        get("/", new IndexHandler()),
        get("/static/client.js", new ClientJsHandler(gen)),
    ]);
    return router.handle(req);
}

export { handleRequest }