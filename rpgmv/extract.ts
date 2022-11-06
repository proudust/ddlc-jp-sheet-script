import { extractFromPage } from "./extract_from_page.ts";
import { type CommonEventsJson, isCommonEventsJson } from "./json/common_events.ts";
import { isMapJson, type MapJson } from "./json/map.ts";

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

  if (isMapJson(json)) {
    return extractFromMapJson(fileName, json);
  } else if (isCommonEventsJson(json)) {
    return extractFromCommonEventsJson(fileName, json);
  } else {
    return [];
  }
}

const extractFromMapJson = (
  fileName: string,
  json: MapJson,
): Translatable[] =>
  (json.events || []).flatMap((event, eIndex) =>
    (event?.pages || []).flatMap((page, pIndex) =>
      extractFromPage(page).map(({ jqFilter, ...other }) => ({
        fileName,
        jqFilter: `.events[${eIndex}].pages[${pIndex}]${jqFilter}`,
        ...other,
      }))
    )
  );

const extractFromCommonEventsJson = (
  fileName: string,
  json: CommonEventsJson,
): Translatable[] =>
  json
    .filter(<T>(page: T): page is Exclude<T, null> => !!page)
    .flatMap((page, eIndex) =>
      extractFromPage(page).map(({ jqFilter, ...other }) => ({
        fileName,
        jqFilter: `.[${eIndex}]${jqFilter}`,
        ...other,
      }))
    );
