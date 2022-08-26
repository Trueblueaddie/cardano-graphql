# This file has been generated by node2nix 1.8.0. Do not edit!
{ pkgs, nodejs }:

let
  nodeEnv = import ./node-env.nix {
    inherit (pkgs) stdenv lib python2 utillinux runCommand writeTextFile;
    inherit nodejs;
    libtool = if pkgs.stdenv.isDarwin then pkgs.darwin.cctools else null;
  };
in
import ./node-packages.nix {
  inherit (pkgs) fetchurl fetchgit sources;
  inherit nodeEnv;
}
