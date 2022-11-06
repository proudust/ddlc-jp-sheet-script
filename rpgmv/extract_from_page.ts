import { isChoicesCommand } from "./command/choices.ts";
import { isFaceCommand } from "./command/face.ts";
import { isTextCommand, type TextCommand } from "./command/text.ts";

interface Command {
  code: number;
  parameters: unknown[];
}

interface EventPage {
  list: Command[];
}

type TranslatableSource = "EventText" | "EventChoices";

interface Translatable {
  jqFilter: string;
  faceFile: string;
  original: string;
  source: TranslatableSource;
}

export function extractFromPage(page: EventPage) {
  const { list } = page;
  const length = list.length;
  const translatable: Translatable[] = [];

  let faceFile = "";
  for (let i = 0; i < length; i++) {
    // Single Text
    const texts = takeTextCommand(list.slice(i));
    if (texts.length === 1) {
      translatable.push({
        jqFilter: `.list[${i}].parameters[0]`,
        faceFile,
        original: texts[0].parameters[0],
        source: "EventText",
      });
      continue;
    }

    // Multi Text
    if (1 < texts.length) {
      translatable.push({
        jqFilter: `.list[${i}:${i + texts.length}][].parameters[0]`,
        faceFile,
        original: texts.map(({ parameters }) => parameters[0]).join("\n"),
        source: "EventText",
      });
      i += texts.length - 1;
      continue;
    }

    // Face
    const curr = list[i];
    if (isFaceCommand(curr)) {
      faceFile = curr.parameters[0];
      continue;
    }

    // Choices
    if (isChoicesCommand(curr)) {
      translatable.push(...curr.parameters[0].map((original, j) => ({
        jqFilter: `.list[${i}].parameters[0][${j}]`,
        faceFile,
        original,
        source: "EventChoices",
      } as const)));
      continue;
    }
  }

  return translatable;
}

function takeTextCommand(list: Command[]): TextCommand[] {
  const texts: TextCommand[] = [];

  for (const command of list) {
    if (isTextCommand(command)) {
      texts.push(command);
    } else {
      return texts;
    }
  }

  return texts;
}
