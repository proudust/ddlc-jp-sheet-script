import { SayTranslate } from '../transrate/sayTranslate';
import { FileTranslate } from '../transrate/fileTranslate';
import { StringsTranslate } from '../transrate/stringsTranslate';
import { Translate } from '../transrate/translate';

interface File {
  fileName: string;
  content: string;
}

interface TranslateGroup {
  say: SayTranslate[];
  file: FileTranslate[];
  strings: StringsTranslate[];
}

/**
 * Translate 配列から翻訳スクリプトを出力する
 */
export class TranslationFileConverter {
  private strings: { [key: string]: StringsTranslate } = {};

  private removeDuplicateStrings(translates: StringsTranslate[]): StringsTranslate[] {
    return translates.reduce<StringsTranslate[]>((array, curr) => {
      if (!this.strings[curr.original]) {
        this.strings[curr.original] = curr;
        array.push(curr);
      } else if (this.strings[curr.original].translate != curr.translate) {
        console.warn(
          'found translation shaking.' +
            `original: "${curr.original}", translate1: "${this.strings[curr.original].translate}", "${curr.translate}"`,
        );
      }
      return array;
    }, []);
  }

  /**
   * Translate 配列から翻訳スクリプトを出力する
   * @param name スクリプトのファイル名
   * @param translates Translate 配列
   */
  public toTranslationFile(name: string, translates: Translate[]): File[] {
    const { say, file, strings } = translates
      .filter(t => t.translate)
      .reduce<TranslateGroup>(
        (group, curr) => {
          if (curr instanceof SayTranslate) group.say.push(curr);
          else if (curr instanceof StringsTranslate) group.strings.push(curr);
          else if (curr instanceof FileTranslate) group.file.push(curr);
          return group;
        },
        { say: [], file: [], strings: [] },
      );
    const script = [
      ...say.map(t => t.inflate()),
      ...(strings.length > 0 ? ['translate Japanese strings:'] : []),
      ...this.removeDuplicateStrings(strings).map(t => t.inflate()),
    ].join('\n');
    return [
      ...(script ? [{ fileName: `${name}.rpy`, content: script }] : []),
      ...file.map(t => t.inflate()),
    ];
  }
}
