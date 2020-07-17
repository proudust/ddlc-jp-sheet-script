interface Sheet {
  getName(): string;
  getRange(a1Notation: string): Range;
}

interface Range {
  getValues(): string[][];
}

interface File {
  name: string;
  content: string;
}

interface TranslationMap {
  [fileName: string]: {
    [jsonPath: string]: {
      [original: string]: string;
    };
  };
}

export function readRow(
  translations: TranslationMap,
  [fileName, jsonPath, original, translation]: string[],
): TranslationMap {
  if (!jsonPath.startsWith('.')) jsonPath = '.';

  if (fileName && original && translation && original !== translation) {
    if (!(fileName in translations)) translations[fileName] = {};
    if (!(jsonPath in translations[fileName])) {
      translations[fileName][jsonPath] = {};
    }

    const o = original.split('\n');
    const t = translation.split('\n');
    for (let i = 0; i < o.length; i++) {
      if (o[i] === t[i]) continue;
      if (
        o[i] in translations[fileName][jsonPath] &&
        translations[fileName][jsonPath][o[i]] !== t[i]
      ) {
        throw new Error(`${o[i]} is duplicate translation.`);
      }
      translations[fileName][jsonPath][o[i]] = t[i] ?? '';
    }
    if (o.length < t.length) {
      translations[fileName][jsonPath][o[o.length - 1]] += ['', ...t.slice(o.length)].join('\n');
    }
  }
  return translations;
}

export function generateCode(sheets: Sheet[]): File[] {
  const translations = sheets.reduce<TranslationMap>(
    (t, s) => s.getRange('A3:D').getValues().reduce<TranslationMap>(readRow, t),
    {},
  );
  const content = JSON.stringify(translations, null, 4);
  return [{ name: 'JP_Translate.json', content }];
}
