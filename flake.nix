{
  description = "Desktop widgets built with Astal and Gnim";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      pname = "widgets";
      entry = "app.ts";
      version = self.shortRev or self.dirtyShortRev or "dev";

      astalPackages = with ags.packages.${system}; [
        io
        astal4
        mpris
        tray
        wireplumber
      ];

      extraPackages = astalPackages ++ [
        pkgs.libadwaita
        pkgs.libsoup_3
        pkgs.gtk4-layer-shell
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation (finalAttrs: {
        inherit pname version;
        src = ./.;

        pnpmDeps = pkgs.fetchPnpmDeps {
          inherit (finalAttrs) pname version src;
          fetcherVersion = 3;
          hash = "sha256-9iSn+6Hu6xCnzdb2x2jNhWC8XmSkfwGkG8T/ENLW374=";
        };

        nativeBuildInputs = with pkgs; [
          nodejs
          pnpm
          pnpmConfigHook
          wrapGAppsHook3
          gobject-introspection
          ags.packages.${system}.default
        ];

        buildInputs = extraPackages ++ [ pkgs.gjs ];

        buildPhase = ''
          runHook preBuild
          pnpm run gen:css
          runHook postBuild
        '';

        installPhase = ''
          runHook preInstall
          mkdir -p $out/bin
          ags bundle ${entry} $out/bin/${pname}
          runHook postInstall
        '';
      });

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override { inherit extraPackages; })
          pkgs.nodejs
          pkgs.pnpm
        ];
      };
    };
}
