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
    [original: string]: string;
  };
}

export function readRow(
  translations: TranslationMap,
  [fileName, , original, translation]: string[],
): TranslationMap {
  if (fileName && original && translation && original !== translation) {
    if (!(fileName in translations)) translations[fileName] = {};

    const os = original.split('\n');
    const ts = translation.split('\n');
    for (let i = 0; i < os.length; i++) {
      const o = os[i];
      let t = ts[i];
      if (i === os.length - 1 && os.length < ts.length) {
        t += ['', ...ts.slice(os.length)].join('\n');
      }

      if (o === t) continue;
      if (o in translations[fileName] && translations[fileName][o] !== t) {
        throw new Error(`${o} is duplicate translation.`);
      }
      translations[fileName][o] = t ?? '';
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
