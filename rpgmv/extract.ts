import { extractFromPage } from "./extract_from_page.ts";
import { type CommonEventsJson, isCommonEventsJson } from "./json/common_events.ts";
import { isMapJson, type MapJson } from "./json/map.ts";

export type TranslatableSource = "MapName" | "EventName" | "EventText" | "EventChoices";

export interface Translatable {
  fileName: string;
  jqFilter: string;
  faceFile?: string;
  original: string;
  source: TranslatableSource;
}

export function extract(fileName: string, fileContent: string): Translatable[] {
  let json: unknown;
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

function extractFromMapJson(fileName: string, json: MapJson): Translatable[] {
  const { displayName, events } = json;
  const translatable: Translatable[] = [];

  if (displayName) {
    translatable.push({
      fileName,
      jqFilter: ".displayName",
      original: json.displayName,
      source: "MapName",
    });
  }

  for (let eIndex = 0; eIndex < events.length; eIndex++) {
    const event = events[eIndex];
    if (!event) {
      continue;
    }
    const { name, pages } = event;

    if (name) {
      translatable.push({
        fileName,
        jqFilter: `.events[${eIndex}].name`,
        original: name,
        source: "EventName",
      });
    }

    for (let pIndex = 0; pIndex < pages.length; pIndex++) {
      const page = pages[pIndex];

      translatable.push(
        ...extractFromPage(page).map(({ jqFilter, ...other }) => ({
          fileName,
          jqFilter: `.events[${eIndex}].pages[${pIndex}]${jqFilter}`,
          ...other,
        })),
      );
    }
  }

  return translatable;
}

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
