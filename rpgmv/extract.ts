import { extractFromPage } from "./extract_from_page.ts";
import { type CommonEventsJson, isCommonEventsJson } from "./json/common_events.ts";
import { isMapJson, type MapJson } from "./json/map.ts";
import { isSystemJson, SystemJson } from "./json/system.ts";

export type TranslatableSource =
  | "MapName"
  | "EventName"
  | "EventText"
  | "EventChoices"
  | "SystemGameTitle"
  | "SystemCommand"
  | "SystemMessage";

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
  } else if (isSystemJson(json)) {
    return extractFromSystemJson(fileName, json);
  } else {
    return [];
  }
}

function extractFromMapJson(fileName: string, json: MapJson): Translatable[] {
  return [
    ...(json.displayName
      ? [
        {
          fileName,
          jqFilter: ".displayName",
          original: json.displayName,
          source: "MapName",
        } as const,
      ]
      : []),
    ...json.events.flatMap((event, eIndex) => [
      ...(event?.name
        ? [
          {
            fileName,
            jqFilter: `.events[${eIndex}].name`,
            original: event.name,
            source: "EventName",
          } as const,
        ]
        : []),
      ...(event?.pages || []).flatMap((page, pIndex) =>
        extractFromPage(page)
          .map(({ jqFilter, ...other }) => ({
            fileName,
            jqFilter: `.events[${eIndex}].pages[${pIndex}]${jqFilter}`,
            ...other,
          }))
      ),
    ]),
  ];
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

function extractFromSystemJson(fileName: string, json: SystemJson): Translatable[] {
  return [
    ...(json.gameTitle
      ? [
        {
          fileName,
          jqFilter: `.gameTitle`,
          original: json.gameTitle,
          source: "SystemGameTitle",
        } as const,
      ]
      : []),
    ...json.terms.commands.flatMap((command, index) => (command
      ? {
        fileName,
        jqFilter: `.terms.commands[${index}]`,
        original: command,
        source: "SystemCommand",
      } as const
      : [])
    ),
    ...Object.entries(json.terms.messages).map(([key, value]) => ({
      fileName,
      jqFilter: `.terms.messages.${key}`,
      original: value,
      source: "SystemMessage",
    } as const)),
  ];
}
