import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { version } from "../version.ts";
import { extractFromFiles } from "./extract_from_files.ts";
import { tsvStringify } from "./tsv_stringify.ts";

await new Command()
  .name("extract")
  .version(version)
  .description("RPG Maker MV Extract Dialogue CLI")
  .arguments("[...file|dir]")
  .action(async (_, ...paths) => {
    const translatable = (await extractFromFiles(paths || [Deno.cwd()]));
    const tab = tsvStringify(translatable);
    await Deno.writeTextFile("dialogues.tab", tab);
  })
  .parse(Deno.args);
