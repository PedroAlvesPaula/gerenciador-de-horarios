{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    openssl
    prisma-engines
  ];

  shellHook = ''
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
    export PRISMA_QUERY_ENGINE_ROUTING_URL="${pkgs.prisma-engines}/bin/query-engine"
    export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
    
    echo "🚀 Ambiente NestJS + Prisma pronto no NixOS!"
  '';
}