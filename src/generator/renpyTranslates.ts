import { trimMargin } from '../util/tags';

export class SayTranslate {
  public readonly type = 'say';
  constructor(
    public readonly id: string,
    public readonly attribute: string,
    public readonly original: string,
    public readonly translate: string,
  ) {}

  public inflate(): string {
    const attrs = this.attribute.split(' ');
    const character = attrs.filter(s => s !== 'nointeract').join(' ');
    const nointeract = this.attribute.includes('nointeract') ? 'nointeract' : '';
    const translates = this.translate.match(/"(.+?[^\\])"/g) || [`"${this.translate}"`];

    return [
      `translate Japanese ${this.id}:`,
      ...translates.map(t => ['   ', character, t, nointeract].filter(Boolean).join(' ')),
      '',
    ].join('\n');
  }
}

export class StringsTranslate {
  public readonly type = 'strings';
  constructor(public readonly original: string, public readonly translate: string) {}

  public inflate(): string {
    const isMultiLines = this.original.match(/\n/g);
    if (!isMultiLines) {
      if (this.original === this.translate) return '';
      return trimMargin`
        |    old "${this.original}"
        |    new "${this.translate}"

      `;
    } else {
      return trimMargin`
        |    old """\\
        |${this.original.replace(/"/g, '\\"')}"""
        |    new """\\
        |${this.translate}"""

      `;
    }
  }
}

interface File {
  name: string;
  content: string;
}

export class FileTranslate {
  public readonly type = 'file';
  constructor(
    public readonly id: string,
    public readonly original: string,
    public readonly translate: string,
  ) {}

  public inflate(): File {
    return { name: this.id, content: this.translate };
  }
}
