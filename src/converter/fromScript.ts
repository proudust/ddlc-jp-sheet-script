import DialogsTranslate from '../transrate/dialogsTranslate';
import StringsTranslate from '../transrate/stringsTranslate';
import Translate from '../transrate/translate';

export default {
  /**
   * スクリプトから Translate 配列に変換する
   */
  convert: (script: string): Translate[] => {
    const dialogs =
      script.match(/translate \S+ \S+_[\da-f]{8}:(?:\s+(?:[\d\w]+ ){0,2}"[\s\S]+?")+/g) || [];
    const strings =
      script.match(/old (?:"""\\|")[\s\S]+?(?:"""|").?\s+new (?:"""\\|")[\s\S]+?(?:"""|")/g) || [];

    return [
      ...dialogs.map(s => {
        const props = s.match(/translate \S+ (\S+_[\da-f]{8}):\s+(?:(\w+(?: [\d\w]+)?) )?"/);
        const dialog = s.match(/"([\s\S]+?)"+/g);
        if (!props || !dialog) throw new Error(`dialog not found. script: ${s}`);
        const translate = dialog.length === 1 ? dialog[0].split('"')[1] : dialog.join('\n');
        return new DialogsTranslate(props[1], props[2] || '', '', translate);
      }),

      ...strings.map(s => {
        const props = s.match(
          /old (?:"""\\|")([\s\S]+?)(?:"""|").?\s+new (?:"""\\|")([\s\S]+?)(?:"""|")/,
        );
        if (!props) throw new Error(`strings not found. script: ${s}`);
        return new StringsTranslate(props[1], props[2]);
      }),
    ];
  },
};
