{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
  ];

  shellHook = ''
    echo "🎨 Ambiente React/Vite (Front-end) pronto no NixOS!"
    echo "➜ Versão do Node: $(node -v)"
    echo "➜ Versão do NPM: $(npm -v)"
  '';
}