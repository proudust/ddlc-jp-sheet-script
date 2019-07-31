import Translate from '../transrate/translate';

export default {
  /**
   * Translate 配列から CSV を出力する
   */
  convert: (translates: Translate[]): string => {
    return (
      translates
        .map(t => [t.id, t.attribute, t.original, t.translate].map(s => `"${s}"`).join(', '))
        .join('\n') + '\n'
    );
  },
};
