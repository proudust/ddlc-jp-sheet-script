import { parse } from "https://deno.land/std@0.162.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.162.0/path/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/mod.ts";
import $ from "https://deno.land/x/dax@0.17.0/mod.ts";
import { build } from "https://deno.land/x/esbuild@v0.15.16/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import { ghDescribe } from "https://deno.land/x/gh_describe@v1.5.3/mod.ts";
import gasPlugin from "https://esm.sh/esbuild-gas-plugin@0.5.0/mod.ts";

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

async function generateVersionTs() {
  const { describe } = await ghDescribe({ defaultTag: "0.0.0" });
  await Deno.writeTextFile("version.ts", `export const version = "${describe}";\n`);
}

async function cliBuild() {
  const targets = [
    "x86_64-unknown-linux-gnu",
    "x86_64-pc-windows-msvc",
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
  ];

  return await Promise.all(targets.map(async (target) => {
    const dist = join("dist", `cli-${target}`);
    await Deno.mkdir(dist, { recursive: true });

    await $`deno compile --allow-read --allow-write --output ${dist}/extract --target ${target} cli/cli.ts`;
    console.log(colors.bold.green("✓"), " ", "CLI", target);
  }));
}

async function gasBuild(dist: string, name: string) {
  const bundleTask = build({
    bundle: true,
    charset: "utf8",
    entryPoints: ["src/index.ts"],
    outfile: join(dist, "out.js"),
    target: "es2017", // Workaround for jquery/esprima#2034
    plugins: [
      denoPlugin(),
      gasPlugin,
    ],
  });
  const copyTask = async (): Promise<void> => {
    await Deno.mkdir(dist, { recursive: true });
    await Deno.copyFile("src/appsscript.json", join(dist, "appsscript.json"));
  };
  await Promise.all([bundleTask, copyTask()]);
  console.log(colors.bold.green("✓"), " ", name);
}

async function gasDeploy(source: string, name: string, scriptId: string) {
  await Deno.writeTextFile(join(source, ".clasp.json"), JSON.stringify({ scriptId }));
  await $`deno run --allow-env --allow-net --allow-read --allow-sys --allow-write npm:@google/clasp@2.4.1 push -f`
    .cwd(source)
    .stdin("\n");
  console.log(colors.bold.green("✓"), " ", name);
}

const args = parse(Deno.args, {});

switch (args._[0] || "build") {
  case "build": {
    await generateVersionTs();
    await Promise.all([
      cliBuild(),
      ...Object.entries(profiles).map(async ([id, { name }]) => {
        const dist = join("dist", `gas-${id}`);
        await gasBuild(dist, name);
      }),
    ]);
    break;
  }
  case "deploy": {
    await Promise.all(
      Object.entries(profiles).map(async ([id, { name, scriptId }]) => {
        const dist = join("dist", `gas-${id}`);
        await gasDeploy(dist, name, scriptId);
      }),
    );
    break;
  }
}

Deno.exit(0);
