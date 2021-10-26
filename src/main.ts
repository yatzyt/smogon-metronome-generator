import { handleRequest } from "./handler.ts";
import { ClientBundleGenerator } from "./types.ts";
import { dirname, fromFileUrl } from "../deps.ts";

class DenoBundleGenerator implements ClientBundleGenerator {
    private srcDir: string;
    private clientJsCached: string | null;
    private clientJsMtime: Date | null;

    constructor() {
        this.srcDir = dirname(fromFileUrl(import.meta.url));
        this.clientJsCached = null;
        this.clientJsMtime = null;
    }

    public async getBundle(): Promise<string> {
        let rebuilding = false;
        const { mtime } = await Deno.stat(`${this.srcDir}/client/client.tsx`);
        if (this.clientJsMtime == null || this.clientJsCached == null || mtime == null) {
            rebuilding = true;
        } else if (mtime.getTime() - this.clientJsMtime.getTime() > 0) { // more recently modified
            rebuilding = true;
        }

        if (rebuilding) {
            const { files, diagnostics } = await Deno.emit(
                `${this.srcDir}/client/client.tsx`,
                {
                    bundle: "module",
                    compilerOptions: {
                        lib: ["dom", "dom.iterable", "esnext"],
                    },
                },
            );

            if (diagnostics) {
                console.warn(diagnostics);
                // TODO exit?
            }
            this.clientJsCached = files["deno:///bundle.js"];
            this.clientJsMtime = mtime;
        }
        return this.clientJsCached!;
    }
}

const PORT = 8000;
const server = Deno.listen({ hostname: "0.0.0.0", port: PORT });
const generator = new DenoBundleGenerator();
console.log(`HTTP server listening on port ${PORT}...`);

while (true) {
    try {
        const conn = await server.accept();
        (async () => {
            const httpConn = Deno.serveHttp(conn);
            while (true) {
                try {
                    const event = await httpConn.nextRequest();
                    if (event) {
                        const request = event.request;
                        const response = await handleRequest(request, generator);
                        console.log(`${request.method} ${request.url} - ${response.status}`);
                        event.respondWith(response);
                    }
                } catch (err) {
                    // The connection has finished
                    console.error(`Connection finished: ${err}`);
                    break;
                }
            }
        })();
    } catch (err) {
        // The listener has closed
        console.error(`Connection closed: ${err}`);
        break;
    }
}