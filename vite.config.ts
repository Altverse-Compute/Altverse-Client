import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import wasm from "vite-plugin-wasm";
import { protobufPatch } from "./vite/protobuf.ts";

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    wasm(),
    protobufPatch(),
  ],
  resolve: {
    alias: {
      "protobufjs/minimal": "protobufjs/dist/minimal/protobuf.min.js",
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      stores: path.resolve(__dirname, "./src/stores"),
      pages: path.resolve(__dirname, "./src/pages"),
      resources: path.resolve(__dirname, "./src/resources"),
    },
  },
  optimizeDeps: {
    include: ["protobufjs"],
  },
});
