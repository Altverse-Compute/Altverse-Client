import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [preact(), tailwindcss(), wasm()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@resources": path.resolve(__dirname, "./src/resources"),
      "@proto": path.resolve(__dirname, "./src/proto/gen"),
      "@bufbuild/protobuf/codegenv2": path.resolve(
        __dirname,
        "node_modules/@bufbuild/protobuf/dist/esm/codegenv2",
      ),
      "@bufbuild/protobuf/wkt": path.resolve(
        __dirname,
        "node_modules/@bufbuild/protobuf/dist/esm/wkt",
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@bufbuild/protobuf"],
  },
});
