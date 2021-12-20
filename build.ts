import { parse } from "https://deno.land/std@0.118.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.118.0/path/mod.ts";
import { build } from "https://deno.land/x/esbuild@v0.12.15/mod.js";
import gasPlugin from "https://esm.sh/esbuild-gas-plugin@0.3.2/mod.ts";
import httpPlugin from "https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js";
import { $, cd } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";

const profiles = {
  "ddlc": {
    name: "Doki Doki Literature Club! 日本語化 作業所",
    scriptId: "1zp64PCtW2FYmfDMXn4nFT5g9tA5CWPAaP-qRBg-i0OUb5mjpX1_iOHYr",
  },
  "ddlc-mas": {
    name: "DDLC Monika After Story 日本語化 作業所",
    scriptId: "1rKilgJgbw-I_EEMvhYPm17X4BkED0xQkuLo_lVWdM90iXyTOhNi9-rh6",
  },
  "ddlc-3rdanniv": {
    name: "DDLC 3rd-anniversary Twitch Writes 日本語化 作業所",
    scriptId: "19u-8kNq3jPbQgr6_QeLqhGH7jJLLT76YjtykLWxXl8ahX1p3GbjDkKhD",
  },
  "dwellers-ep": {
    name: "Dweller's Empty Path 日本語化 作業所",
    scriptId: "1jv0pY3SZDm8_gCV_4DwI80NQTDWwJMY5Bci0ZGkNa7L2gXN_IG7XGp5P",
  },
  "dwellers-ec": {
    name: "Escaped Chasm 日本語化 作業所",
    scriptId: "1JJPXEJ8hzzfHXnkPTfXbL3iAiPoaJB2ZTa6Iq4DkYHnNpAXfM0pe35jq",
  },
} as const;

async function gasBuild(dist: string) {
  const bundleTask = build({
    bundle: true,
    charset: "utf8",
    entryPoints: ["src/index.ts"],
    outfile: join(dist, "out.js"),
    target: "es2019",
    plugins: [
      httpPlugin,
      gasPlugin,
    ],
  });
  const copyTask = async (): Promise<void> => {
    await Deno.mkdir(dist, { recursive: true });
    await Deno.copyFile("src/appsscript.json", join(dist, "appsscript.json"));
  };
  await Promise.all([bundleTask, copyTask()]);
}

async function gasDeploy(source: string, scriptId: string) {
  await Deno.writeTextFile(join(source, ".clasp.json"), JSON.stringify({ scriptId }));
  cd(source);
  await $`clasp push -f`;
}

const args = parse(Deno.args, {});

switch (args._[0] || "build") {
  case "build": {
    await Promise.all(
      Object.entries(profiles).map(async ([id]) => {
        const dist = join("dist", id);
        await gasBuild(dist);
      }),
    );
    break;
  }
  case "deploy": {
    await Promise.all(
      Object.entries(profiles).map(async ([id, { scriptId }]) => {
        const dist = join("dist", id);
        await gasDeploy(dist, scriptId);
      }),
    );
    break;
  }
}

Deno.exit(0);
