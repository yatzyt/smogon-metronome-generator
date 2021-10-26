{
  description = "Smogon Metronome Team Generator";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nur.url = "github:nix-community/NUR";
  };

  outputs = { self, nixpkgs, flake-utils, nur }:
    let name = "smogon-metronome-generator";
    in
    flake-utils.lib.eachDefaultSystem
    (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ nur.overlay ];
        };
        buildInputs = with pkgs; [
          deno
        ];
        package = pkgs.stdenv.mkDerivation {
          inherit name;
          inherit buildInputs;
          src = ./.;
          buildPhase = "deno compile --output ${name} ./src/main.ts";
          installPhase = "mkdir -p $out/bin; install -t $out/bin ${name}";
        };
        nativeBuildInputs = with pkgs; [
          nixpkgs-fmt
          wrangler
          pkgs.nur.repos.moosingin3space.velociraptor
        ];
      in
      rec {
        packages.${name} = package;
        defaultPackage = packages.${name};
        devShell = pkgs.mkShell {
          inherit buildInputs nativeBuildInputs;
        };
      }
    );
}
