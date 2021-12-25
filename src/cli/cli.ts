import { stringify } from "https://deno.land/std@0.118.0/encoding/csv.ts";
import { expandGlob } from "https://deno.land/std@0.118.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.118.0/path/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { extract, type Translatable } from "../rpgmv/extract.ts";
import { version } from "../../version.ts";

type CommandOptions = void;
type CommandArguments = [paths: string[] | undefined];

await new Command<CommandOptions, CommandArguments>()
  .name("extract")
  .version(version)
  .description("RPG Maker MV Extract Dialogue CLI")
  .arguments("[...file|dir]")
  .action(async (_, paths = [Deno.cwd()]) => {
    const translatables = (await Promise.all(paths.flatMap(async (path) => {
      const { isFile } = await Deno.stat(path);

      if (isFile) {
        const fileName = basename(path);
        return (async () => extract(fileName, await Deno.readTextFile(path)))();
      } else {
        const primises: Promise<Translatable[]>[] = [];
        for await (const f of expandGlob("**/*.json", { root: path })) {
          primises.push((async () => extract(f.name, await Deno.readTextFile(f.path)))());
        }
        return (await Promise.all(primises)).flat();
      }
    }))).flat();

    const tab = await stringify(
      translatables as unknown as Record<string, unknown>[],
      [
        "fileName",
        "jqFilter",
        { prop: "original", fn: (str: string) => str.replaceAll("\n", "\\n") },
      ],
      { separator: "\t" },
    );

    await Deno.writeTextFile("dialogues.tab", tab);
  })
  .parse(Deno.args);
