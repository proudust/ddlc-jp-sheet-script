import {
  FileTranslate,
  SayTranslate,
  StringsTranslate,
} from "./renpyTranslates";

type Translate = StringsTranslate | SayTranslate | FileTranslate;

/**
 * シートの 1 行を読み込み、Translate オブジェクトまたは undefined を返す。
 * @param array シートの 1 行
 */
export function parseRow(
  [id, attribute, original, translate]: string[],
): Translate | undefined {
  if ((id === "" && attribute === "") || translate === "") return;

  if (attribute === "strings") return new StringsTranslate(original, translate);

  if (/^[\S]+_[\da-f]{8}(_\d)?$/.test(id)) {
    return new SayTranslate(id, attribute, original, translate);
  }

  if (id.endsWith(".txt")) return new FileTranslate(id, original, translate);

  return;
}

/**
 * SayTranslate オブジェクトからヒストリーの言語切替に必要な翻訳を生成します
 * @param say 生成元の SayTranslate 配列
 */
export function convaerHistorySupport(say: SayTranslate[]): StringsTranslate[] {
  return say.map(({ id, translate }) => {
    const translates = translate.match(/"(.+?[^\\])"/g)?.map((t) =>
      t.slice(1, -1)
    ) ?? [translate];
    return new StringsTranslate(`{#${id}}`, translates.join("\\n"));
  });
}

interface File {
  name: string;
  content: string;
}

interface GroupedTranslate {
  strings?: StringsTranslate[];
  say?: SayTranslate[];
  file?: FileTranslate[];
}

/**
 * パースして得られた Translate 配列から翻訳スクリプトや翻訳後のファイルを生成します
 * @param name                  シート名
 * @param translates            生成元の Translate 配列
 * @param includeHistorySupport true の場合、ヒストリーの言語切替に必要な翻訳も生成します
 */
export function inflate(
  name: string,
  translates: Translate[],
  includeHistorySupport = false,
): File[] {
  const {
    strings = [],
    say = [],
    file: files = [],
  } = translates.reduce<GroupedTranslate>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (
      obj,
      cur,
    ) => ((obj[cur.type] || (obj[cur.type] = [])).push(cur as any), obj),
    {},
  );
  if (includeHistorySupport) strings.push(...convaerHistorySupport(say));
  const script = [
    ...say?.map((t) => t.inflate()),
    ...(strings.length ? ["translate Japanese strings:"] : []),
    ...strings.map((t) => t.inflate()),
  ].join("\n");
  return [
    ...(script ? [{ name: `${name}.rpy`, content: script }] : []),
    ...(files?.map((f) => f.inflate()) ?? []),
  ];
}

interface Range {
  getValues(): string[][];
}

interface Sheet {
  getName(): string;
  getRange(a1Notation: string): Range;
}

interface ParsedSheet {
  name: string;
  translates: Translate[];
}

/**
 * 翻訳対象が同じの StringTranslate オブジェクトを取り除く。
 * またそれにより Translate 配列が空になった場合、そのシートを取り除く。
 * @param sheets 対象となるシートの配列
 */
export function removeDuplicateStrings(sheets: ParsedSheet[]): ParsedSheet[] {
  const strings = new Map<string, string>();
  return sheets
    .map(({ name, translates }) => ({
      name,
      translates: translates.filter(
        ({ type, original, translate }) =>
          type !== "strings" ||
          (!strings.has(original) && strings.set(original, translate)),
      ),
    }))
    .filter(({ translates }) => translates.length);
}

/**
 * シートから翻訳ファイルを生成します
 * @param sheet                 シート
 * @param includeHistorySupport true の場合、ヒストリーの言語切替に必要な翻訳も生成します
 */
export function generateCode(
  sheets: Sheet[],
  includeHistorySupport: boolean,
): File[] {
  const parsedSheet = sheets.map((s) => ({
    name: s.getName(),
    translates: s
      .getRange("A3:D")
      .getValues()
      .map(parseRow)
      .filter(<T>(x: T | undefined): x is T => !!x),
  }));
  return removeDuplicateStrings(parsedSheet).reduce<File[]>(
    (files, { name, translates }) =>
      files.concat(inflate(name, translates, includeHistorySupport)),
    [],
  );
}
