import { fromSpreadsheet } from '../../converter/fromSpreadsheet';

import { characterSay, nointeractSay, longSay, poemTitle, file } from '../testResource';

describe(`function fromSpreadsheet`, () => {
  it('do', () => {
    const sheet = [
      poemTitle,
      characterSay,
      { ...characterSay, id: 'ch0_main_41e273ca_1' },
      nointeractSay,
      longSay,
      file,
    ];
    expect(fromSpreadsheet(sheet)).toMatchObject([
      {
        id: '',
        attribute: 'strings',
        original: 'Ghost Under the Light',
        translate: '燈の下の幽霊',
      },
      {
        id: 'ch0_main_41e273ca',
        attribute: 's',
        original: 'Heeeeeeeyyy!!',
        translate: '「おーはーよーーー！」',
      },
      {
        id: 'ch0_main_41e273ca_1',
        attribute: 's',
        original: 'Heeeeeeeyyy!!',
        translate: '「おーはーよーーー！」',
      },
      {
        id: 'ch3_end_sayori_dd9616f1',
        attribute: 'm nointeract',
        original: nointeractSay.original,
        translate: nointeractSay.translate,
      },
      {
        id: 'ch0_main_cb634d94',
        attribute: '',
        original: longSay.original,
        translate: longSay.translate,
      },
      {
        id: file.id,
        attribute: 'file',
        original: file.original,
        translate: file.translate,
      },
    ]);
  });
});
