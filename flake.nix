{
  description = "Development shells for code project";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      # C libraries needed for python
      cLibs = with pkgs; [ stdenv.cc.cc.lib zlib libffi openssl ];
    in {
      devShells.${system} = {
        default = pkgs.mkShell {
          packages = with pkgs; [
            # Go tools
            go
            gopls

            # Python tools
            python312
            uv
            ruff

            # React tools
            nodejs_22
            pnpm
          ];

          shellHook = ''
            export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath cLibs}:$LD_LIBRARY_PATH"
            echo "Universal development environment loaded (Go, Python, Node/React)."
          '';
        };

        # 2. Go Shell: Activated with `nix develop .#go`
        go = pkgs.mkShell {
          packages = with pkgs; [ go gopls gotools ];
        };

        # 3. Python Shell: Activated with `nix develop .#python`
        python = pkgs.mkShell {
          packages = with pkgs; [ python312 uv ruff mypy python312Packages.pytest ];
          shellHook = ''
            export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath cLibs}:$LD_LIBRARY_PATH"
          '';
        };

        # 4. React / Node Shell: Activated with `nix develop .#react`
        react = pkgs.mkShell {
          packages = with pkgs; [ nodejs_22 pnpm ];
        };
      };
    };
}
