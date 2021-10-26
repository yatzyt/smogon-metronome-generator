/// <reference no-default-lib="true"/>
/// <reference lib="deno.worker"/>
/// <reference types="./cf-workers.d.ts"/>

import { ClientBundleGenerator } from "./types.ts";
import { handleRequest } from "./handler.ts";

class CloudflareKvBundleGenerator implements ClientBundleGenerator {
    private ns: KVNamespace;

    constructor(ns: KVNamespace) {
        this.ns = ns;
    }

    public async getBundle(): Promise<string> {
        const bundle = await this.ns.get('clientBundle');
        if (!bundle) {
            throw "Could not find JS";
        }
        return bundle;
    }
}

export default {
    async fetch(request: Request, env: any, _ctx: ExecutionContext) {
        const gen = new CloudflareKvBundleGenerator(env.STATIC_ASSETS);
        return await handleRequest(request, gen);
    }
}