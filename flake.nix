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
      entry = "src/app.ts";
      version = self.shortRev or self.dirtyShortRev or "dev";

      astalPackages = with ags.packages.${system}; [
        io
        astal4
        cava
        mpris
        notifd
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
          hash = "sha256-3UuJB05RLVPDKsc1Mn7s1p0WOJxatapWfcLEDuRUUwA=";
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

        preFixup = ''
          gappsWrapperArgs+=(--prefix XDG_DATA_DIRS : "${pkgs.lucide}/share")
          gappsWrapperArgs+=(--prefix GIO_EXTRA_MODULES : "${pkgs.glib-networking}/lib/gio/modules")
        '';
      });

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override { inherit extraPackages; })
          pkgs.nodejs
          pkgs.pnpm
          pkgs.watchexec
          pkgs.lucide
        ];
        shellHook = ''
          export XDG_DATA_DIRS="${pkgs.lucide}/share''${XDG_DATA_DIRS:+:$XDG_DATA_DIRS}"
          export GIO_EXTRA_MODULES="${pkgs.glib-networking}/lib/gio/modules''${GIO_EXTRA_MODULES:+:$GIO_EXTRA_MODULES}"
        '';
      };
    };
}
