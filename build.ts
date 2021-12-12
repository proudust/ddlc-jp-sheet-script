import { build } from "https://deno.land/x/esbuild@v0.12.15/mod.js";
import { default as GasPlugin } from "https://esm.sh/esbuild-gas-plugin@0.3.2/mod.ts";

const bundleTask = build({
  bundle: true,
  charset: "utf8",
  entryPoints: ["src/index.ts"],
  outfile: "dist/out.js",
  plugins: [GasPlugin],
});

const copyTask = async (): Promise<void> => {
  await Deno.mkdir("dist", { recursive: true });
  await Deno.copyFile("src/appsscript.json", "dist/appsscript.json");
};

await Promise.all([bundleTask, copyTask()]);

Deno.exit();
