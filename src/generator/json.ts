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

    const os = original.split('\n');
    const ts = translation.split('\n');
    for (let i = 0; i < os.length; i++) {
      const o = os[i];
      let t = ts[i] ?? '';
      if (i === os.length - 1 && os.length < ts.length) {
        t += ['', ...ts.slice(os.length)].join('\n');
      }

      if (o === t) continue;
      if (o in translations[fileName][jsonPath] && translations[fileName][jsonPath][o] !== t) {
        throw new Error(`${o} is duplicate translation.`);
      }
      translations[fileName][jsonPath][o] = t;
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
