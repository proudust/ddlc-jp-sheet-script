import { FileTranslate } from '../../transrate/fileTranslate';

import { file } from '../testResource';

describe(`class FileTranslate`, () => {
  describe(`FileTranslate#inflate`, () => {
    it('do', () => {
      const t = new FileTranslate('CAN YOU HEAR ME.txt', file.original, file.translate);
      expect(t.inflate()).toStrictEqual({
        fileName: 'CAN YOU HEAR ME.txt',
        content: file.translate,
      });
    });
  });
});
