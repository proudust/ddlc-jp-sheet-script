import Translate from './translate';

export default class DialogsTranslate implements Translate {
  /** 識別子 (ラベル_ハッシュ) */
  public readonly id: string;
  /** 属性 (キャラクタ 立ち絵 nointeract) */
  public get attribute(): string {
    const attrs = [this.character];
    this.nointeract && attrs.push('nointeract');
    return attrs.join(' ');
  }
  /** 原文 */
  public readonly original: string;
  /** 翻訳 */
  public readonly translate: string;

  /** キャラクタ 立ち絵 */
  private readonly character: string;
  /** nointeract フラグ */
  private readonly nointeract: boolean;

  /**
   * @param id ラベル名とハッシュを _ で繋いだ文字列
   * @param character キャラクターと立ち絵
   * @param original 原文
   * @param translate 翻訳
   * @param nointeract nointeract を末尾に付ける場合は true
   */
  public constructor(
    id: string,
    character: string,
    original: string,
    translate: string,
    nointeract?: boolean,
  ) {
    this.id = id;
    this.character = character;
    this.original = original;
    this.translate = translate;
    this.nointeract = nointeract || false;
  }

  /**
   * 引数の Translate インスタンスから翻訳をコピーした新しい Translate インスタンスを作成する。
   * @param theirs もう一つのマージ対象
   */
  public marge(theirs: Translate): DialogsTranslate {
    return new DialogsTranslate(
      this.id,
      this.character,
      this.original,
      theirs.translate,
      this.nointeract,
    );
  }

  /**
   * Translate インスタンスをスクリプトに変換する。
   * @returns 変換後のスクリプト
   */
  public inflate(): string {
    const attribute = this.character ? `${this.character} ` : '';
    const dialogs = this.translate.match(/"(.*?)"/g);
    // 台詞分割無し
    if (!dialogs) {
      return `translate Japanese ${this.id}:
    ${attribute}"${this.translate}"${this.nointeract ? ' nointeract' : ''}
`;
    }
    // 台詞分割あり
    else {
      return `translate Japanese ${this.id}:
    ${dialogs.map(d => attribute + d).join('\n    ')}
`;
    }
  }
}
