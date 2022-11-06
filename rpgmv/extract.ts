import { takeWhile } from "https://deno.land/std@0.162.0/collections/mod.ts";
import * as c from "./command/mod.ts";
import * as j from "./json/mod.ts";
import { check, guard } from "./zod.ts";

export type UnknownJson =
  | null
  | string
  | number
  | boolean
  | { [K in string]?: UnknownJson }
  | UnknownJson[];

export interface Translatable {
  fileName: string;
  jqFilter: string;
  faceFile: string;
  original: string;
}

export function extract(fileName: string, fileContent: string): Translatable[] {
  let json: UnknownJson;
  try {
    json = JSON.parse(fileContent);
  } catch (e: unknown) {
    if (e instanceof SyntaxError) return [];
    throw e;
  }

  if (check(j.mapJson, json)) {
    return extractFromMapJson(fileName, json);
  } else if (check(j.commonEventsJson, json)) {
    return extractFromCommonEventsJson(fileName, json);
  } else {
    return [];
  }
}

const extractFromMapJson = (fileName: string, json: j.MapJson): Translatable[] =>
  (json.events || []).flatMap((event, eIndex) =>
    (event?.pages || []).flatMap((page, pIndex) => {
      const { list } = page;
      const translatable: Translatable[] = [];
      let faceFile = "";

      for (let cIndex = 0; cIndex < list.length; cIndex++) {
        // Single Text
        const chunk = takeWhile(page.list.slice(cIndex), guard(c.textCommand)) as c.TextCommand[];
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
        if (check(c.faceCommand, curr)) {
          faceFile = curr.parameters[0];
        }
        // Choices
        if (check(c.choicesCommand, curr)) {
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

const extractFromCommonEventsJson = (fileName: string, json: j.CommonEventsJson): Translatable[] =>
  json
    .filter(<T>(event: T): event is Exclude<T, null> => !!event)
    .flatMap((event, eIndex) => {
      const { list } = event;
      const translatable: Translatable[] = [];
      let faceFile = "";

      for (let cIndex = 0; cIndex < list.length; cIndex++) {
        // Single Text
        const chunk = takeWhile(list.slice(cIndex), guard(c.textCommand)) as c.TextCommand[];
        if (chunk.length === 1) {
          translatable.push({
            fileName,
            jqFilter: `.[${eIndex}].list[${cIndex}].parameters[0]`,
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
            jqFilter: `.[${eIndex}].list[${cIndex}:${end}][].parameters[0]`,
            faceFile,
            original: chunk.map(({ parameters }) => parameters[0]).join("\n"),
          });
          cIndex += chunk.length - 1;
          continue;
        }
        // Face
        const curr = list[cIndex];
        if (check(c.faceCommand, curr)) {
          faceFile = curr.parameters[0];
        }
        // Choices
        if (check(c.choicesCommand, curr)) {
          translatable.push(...curr.parameters[0].map((original, i) => ({
            fileName,
            jqFilter: `.events[${eIndex}].list[${cIndex}].parameters[0][${i}]`,
            faceFile,
            original,
          } as const)));
        }
      }

      return translatable;
    });
