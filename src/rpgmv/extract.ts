import { takeWhile, z } from "../../deps.ts";
import * as j from "./data_types.ts";

// deno-lint-ignore no-explicit-any
function check<T extends z.ZodType<any, any, any>>(
  zodObject: T,
  data: unknown,
): data is z.infer<T> {
  return zodObject.safeParse(data).success;
}

// deno-lint-ignore no-explicit-any
function guard<T extends z.ZodType<any, any, any>>(
  zodObject: T,
): (data: unknown) => data is z.infer<T> {
  return (data: unknown): data is z.infer<T> => zodObject.safeParse(data).success;
}

export type Translatable = TranslatableTextCommand | TranslatableChoicesCommand;

export function extract(
  fileName: string,
  fileContent: string,
): Translatable[] {
  const json: j.UnknownJson = JSON.parse(fileContent);
  if (check(j.mapJson, json)) {
    return extractFromMapJson(fileName, json);
  } else {
    return [];
  }
}

interface TranslatableTextCommand {
  fileName: string;
  jqFilter:
    | `.events[${number}].pages[${number}].list[${number}].parameters[0]`
    | `.events[${number}].pages[${number}].list[${number}:${number}][].parameters[0]`;
  faceFile: string;
  original: string;
}

interface TranslatableChoicesCommand {
  fileName: string;
  jqFilter: `.events[${number}].pages[${number}].list[${number}].parameters[0][${number}]`;
  faceFile: string;
  original: string;
}

const extractFromMapJson = (fileName: string, json: j.MapJson): Translatable[] =>
  (json.events || []).flatMap((event, eIndex) =>
    (event?.pages || []).flatMap((page, pIndex) => {
      const { list } = page;
      const translatable: Translatable[] = [];
      let faceFile = "";

      for (let cIndex = 0; cIndex < list.length; cIndex++) {
        // Single Text
        const chunk = takeWhile(page.list.slice(cIndex), guard(j.textCommand)) as j.TextCommand[];
        if (chunk.length === 1) {
          translatable.push({
            fileName,
            jqFilter: `.events[${eIndex}].pages[${pIndex}].list[${cIndex}].parameters[0]`,
            faceFile,
            original: chunk[0].parameters[0],
          });
          continue;
        }
        // Multi Text
        if (1 < chunk.length) {
          const end = cIndex + chunk.length;
          translatable.push({
            fileName,
            jqFilter: `.events[${eIndex}].pages[${pIndex}].list[${cIndex}:${end}][].parameters[0]`,
            faceFile,
            original: chunk.map(({ parameters }) => parameters[0]).join("\n"),
          });
          cIndex += chunk.length - 1;
          continue;
        }
        // Face
        const curr = list[cIndex];
        if (check(j.faceCommand, curr)) {
          faceFile = curr.parameters[0];
        }
        // Choices
        if (check(j.choicesCommand, curr)) {
          translatable.push(...curr.parameters[0].map((original, i) => ({
            fileName,
            jqFilter: `.events[${eIndex}].pages[${pIndex}].list[${cIndex}].parameters[0][${i}]`,
            faceFile,
            original,
          } as const)));
        }
      }

      return translatable;
    })
  );
