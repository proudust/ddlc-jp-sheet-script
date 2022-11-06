import { expandGlob } from "https://deno.land/std@0.162.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.162.0/path/mod.ts";
import { extract, type Translatable } from "../rpgmv/extract.ts";

export async function extractFromFile(path: string): Promise<Translatable[]> {
  const fileName = basename(path);
  const fileContent = await Deno.readTextFile(path);
  return extract(fileName, fileContent);
}

export async function extractFromFiles(paths: string[]): Promise<Translatable[]> {
  return (await Promise
    .all(paths.flatMap(async (path) => {
      const { isFile } = await Deno.stat(path);

      if (isFile) {
        return extractFromFile(path);
      } else {
        const promises: Promise<Translatable[]>[] = [];
        for await (const f of expandGlob("**/*.json", { root: path })) {
          promises.push(extractFromFile(f.path));
        }
        return (await Promise.all(promises)).flat();
      }
    })))
    .flat();
}
