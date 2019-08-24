import Translate from '../transrate/translate';

interface File {
  fileName: string;
  content: string;
}

export default {
  /**
   * Translate 配列から翻訳スクリプトを出力する
   */
  convert: (name: string, translates: Translate[]): File[] => {
    const defalutFile = { fileName: `${name}.rpy`, content: '' };
    const files = translates
      .filter(t => t.translate)
      .sort((a, b) => {
        if (a.constructor.name < b.constructor.name) {
          return -1;
        }
        if (a.constructor.name > b.constructor.name) {
          return 1;
        }
        return 0;
      })
      .reduce<File[]>((array, curr, index, source) => {
        const before = index > 0 ? source[index - 1] : null;
        const output = curr.inflate(before);
        if (typeof output === 'string') {
          defalutFile.content += (before ? '\n' : '') + output;
        } else if (output) {
          array.push(output);
        }
        return array;
      }, []);
    if (defalutFile.content) files.unshift(defalutFile);
    return files;
  },
};
