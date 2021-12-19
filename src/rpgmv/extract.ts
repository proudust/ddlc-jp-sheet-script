import { takeWhile, z } from "../../deps.ts";

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

type UnknownJson =
  | null
  | string
  | number
  | boolean
  | { [K in string]?: UnknownJson }
  | UnknownJson[];

export function extract(
  fileName: string,
  fileContent: string,
): Translatable[] {
  const json: UnknownJson = JSON.parse(fileContent);
  if (check(mapJson, json)) {
    return extractFromMapJson(fileName, json);
  } else {
    return [];
  }
}

const anyCommand = z.object({
  code: z.number(),
  parameters: z.array(z.unknown()),
});

const mapJson = z.object({
  events: z.array(z.nullable(
    z.object({
      name: z.string(),
      pages: z.array(z.object({
        list: z.array(anyCommand),
      })),
    }),
  )),
});

type MapJson = z.infer<typeof mapJson>;

const textCommand = z.object({
  code: z.literal(401),
  parameters: z.tuple([z.string()]),
});

type TextCommand = z.infer<typeof textCommand>;

const faceCommand = z.object({
  code: z.literal(101),
  parameters: z.tuple([z.string(), z.number(), z.number(), z.number()]),
});

const choicesCommand = z.object({
  code: z.literal(102),
  parameters: z.tuple([z.array(z.string()), z.number(), z.number(), z.number(), z.number()]),
});

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

const extractFromMapJson = (fileName: string, json: MapJson): Translatable[] =>
  (json.events || []).flatMap((event, eIndex) =>
    (event?.pages || []).flatMap((page, pIndex) => {
      const { list } = page;
      const translatable: Translatable[] = [];
      let faceFile = "";

      for (let cIndex = 0; cIndex < list.length; cIndex++) {
        // Single Text
        const chunk = takeWhile(page.list.slice(cIndex), guard(textCommand)) as TextCommand[];
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
        if (check(faceCommand, curr)) {
          faceFile = curr.parameters[0];
        }
        // Choices
        if (check(choicesCommand, curr)) {
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
