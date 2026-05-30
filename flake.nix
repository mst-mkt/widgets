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
      ];

      extraPackages = astalPackages ++ [
        pkgs.libadwaita
        pkgs.libsoup_3
        pkgs.gtk4-layer-shell
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        inherit pname version;
        src = ./.;

        nativeBuildInputs = with pkgs; [
          wrapGAppsHook3
          gobject-introspection
          ags.packages.${system}.default
        ];

        buildInputs = extraPackages ++ [ pkgs.gjs ];

        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r * $out/share
          ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

          runHook postInstall
        '';
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override { inherit extraPackages; })
          pkgs.nodejs
          pkgs.pnpm
        ];
      };
    };
}
