import { FileTranslate } from '../../transrate/fileTranslate';

import { file } from '../testResource';

describe(`class FileTranslate`, () => {
  describe(`FileTranslate#inflate`, () => {
    it('do', () => {
      const t = new FileTranslate(file);
      expect(t.inflate()).toStrictEqual({
        fileName: file.id,
        content: file.translate,
      });
    });
  });
});
