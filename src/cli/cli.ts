import { parse } from "https://deno.land/std@0.118.0/flags/mod.ts";
import { expandGlob } from "https://deno.land/std@0.118.0/fs/mod.ts";
import { trimIndent } from "../../deps.ts";
import { extract, type Translatable } from "../rpgmv/extract.ts";
import { stringify } from "https://deno.land/std@0.118.0/encoding/csv.ts";

const {
  _: args,
  help,
  version,
} = parse(Deno.args, {
  alias: {
    h: "help",
    v: "version",
  },
});

if (help) {
  const message = trimIndent`
    RPG Maker MV Extract Dialogue CLI

    Usage:
      extract [options] [files...]

    Meta Options:
    -h, --help      Show command usage
    -v, --version   Show version
  `;
  console.log(message);
  Deno.exit(0);
}

if (version) {
  const message = trimIndent`
    extract - RPG Maker MV Extract Dialogue CLI
    v0.0.1
    https://github.com/proudust/ddlc-jp-sheet-script
  `;
  console.log(message);
  Deno.exit(0);
}

const status = await Deno.permissions.request({ name: "read" });
if (status.state !== "granted") {
  Deno.exit(1);
}

const files = args.length ? args : [Deno.cwd()];
while (0 < files.length) {
  const root = String(files.pop());
  const translatable: Translatable[] = [];
  for await (const file of expandGlob("**/*.json", { root })) {
    translatable.push(...extract(file.name, await Deno.readTextFile(file.path)));
  }

  const tab = await stringify(
    translatable as unknown as Record<string, unknown>[],
    [
      "fileName",
      "jqFilter",
      { prop: "original", fn: (str: string) => str.replaceAll("\n", "\\n") },
    ],
    { separator: "\t" },
  );

  const status = await Deno.permissions.request({ name: "write", path: "./dialogues.tab" });
  if (status.state !== "granted") {
    console.log(tab);
  } else {
    await Deno.writeTextFile("dialogues.tab", tab);
  }
}
