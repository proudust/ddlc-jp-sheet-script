import { z } from "../../deps.ts";

export type UnknownJson =
  | null
  | string
  | number
  | boolean
  | { [K in string]?: UnknownJson }
  | UnknownJson[];

// -- commands

export const faceCommand = z.object({
  code: z.literal(101),
  parameters: z.tuple([
    z.string(),
    z.number(),
    z.number(),
    z.number(),
  ]),
});

export type FaceCommand = z.infer<typeof faceCommand>;

export const choicesCommand = z.object({
  code: z.literal(102),
  parameters: z.tuple([
    z.array(z.string()),
    z.number(),
    z.number(),
    z.number(),
    z.number(),
  ]),
});

export type ChoicesCommand = z.infer<typeof choicesCommand>;

export const textCommand = z.object({
  code: z.literal(401),
  parameters: z.tuple([
    z.string(),
  ]),
});

export type TextCommand = z.infer<typeof textCommand>;

// -- CommonEvents.json

export const commonEventsJson = z.array(
  z.nullable(z.object({
    list: z.array(z.object({
      code: z.number(),
      parameters: z.array(z.unknown()),
    })),
  })),
);

export type CommonEventsJson = z.infer<typeof commonEventsJson>;

// -- MapXXX.json

export const mapJson = z.object({
  events: z.array(
    z.nullable(z.object({
      name: z.string(),
      pages: z.array(z.object({
        list: z.array(z.object({
          code: z.number(),
          parameters: z.array(z.unknown()),
        })),
      })),
    })),
  ),
});

export type MapJson = z.infer<typeof mapJson>;
