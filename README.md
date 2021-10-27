# Smogon Metronome Generator

This is a simple generator for creating random Metronome battles on Pokemon
Showdown. Initially created so that my friends and I could easily create teams
with the same ruleset.

View live [here](https://smogon-metronome-generator.mooshq.xyz).

## Development Set-Up

There are a few ways to set up a development environment for this application.
It is my intention to use few dependencies to make development easy. As a
result, the only required dependency is:
- [Deno](https://deno.land) version 1.15+, an all-in-one JavaScript and
  TypeScript development toolkit.

There are a few optional dependencies:
- [Velociraptor](https://velociraptor.run), a command-runner for Deno. With Deno
  installed, installing Velociraptor is easy. This application uses Velociraptor
  to provide some scripts to automate running the server with the correct Deno
  command-line arguments, and to build the bundles for Cloudflare Workers.
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler), a CLI tool
  for deploying Cloudflare Workers applications.

You can optionally use the [Nix](https://nixos.org) flake in this repository to
automatically configure an environment with all of these dependencies already
installed.

## Running the Server

No matter which method you use to set up dependencies, you can run the
development server like so:

```
$ deno run --unstable --allow-net --allow-read src/main.ts
```

This will launch a local development server on port 8000.

If you have installed [Velociraptor](https://velociraptor.run), you can simply
run

```
$ vr denoServer
```

to get the same effect.