import Translate from '../transrate/translate';

type SpreadsheetRow = [string, string, string, string, '', string, string];

const getLabel = (id: string): string | undefined => (id.match(/([\S]+)_[\da-f]{8}/) || [])[1];

export default {
  /**
   * Translate 配列から翻訳スクリプトを出力する
   */
  convert: (translates: Translate[]): SpreadsheetRow[] => {
    let before = '';
    return translates
      .map(t => [t.id, t.attribute, t.original, t.translate, '', t.tag, t.comments])
      .reduce<SpreadsheetRow[]>((array, curr, index, befores) => {
        before = getLabel(curr[0]) || before;
        if (index && befores[index - 1][0] && getLabel(befores[index - 1][0]) != before) {
          array.push(['', '', '', '', '', '', '']);
        }
        array.push(curr as SpreadsheetRow);
        return array;
      }, []);
  },
};
