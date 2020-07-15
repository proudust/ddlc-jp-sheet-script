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
    if (original in translations[fileName])
      throw new Error(`${original} is duplicate translation.`);
    translations[fileName][original] = translation;
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
