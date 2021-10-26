const frontendBundle = "dist/frontend.mjs";
const bundleFrontendCommand = `deno bundle src/client/client.tsx ${frontendBundle}`;
const bindingName = "STATIC_ASSETS";
const bundleKeyName = "clientBundle";

const makeWranglerUploadCommand = (preview: boolean): string => (
    `wrangler kv:key put -p --binding=${bindingName} ${preview ? '--preview' : ''} "${bundleKeyName}" ${frontendBundle}`
)

export default {
    scripts: {
        denoServer: {
            desc: "Runs the Deno-based local development server.",
            cmd: "src/main.ts",
            allow: {
                net: true,
                read: true,
            },
            unstable: true,
            watch: true,
        },
        buildFrontendBundle: {
            desc: "Statically builds the front-end bundle.",
            cmd: bundleFrontendCommand,
        },
        buildForWorkers: {
            desc: "Builds the code for Cloudflare Workers",
            cmd: [
                {
                    pll: [
                        bundleFrontendCommand,
                        "deno bundle src/cloudflare.ts dist/worker.mjs"
                    ],
                    desc: "Bundle both front-end and back-end code.",
                },
                {
                    pll: [
                        makeWranglerUploadCommand(false),
                        makeWranglerUploadCommand(true),
                    ],
                    desc: "Upload bundle to Workers"
                },
            ],
        },
    },
};