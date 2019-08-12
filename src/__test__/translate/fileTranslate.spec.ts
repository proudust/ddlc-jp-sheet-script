import FileTranslate from '../../transrate/fileTranslate';
import TestResource from '../testResource';

describe(`class FileTranslate`, () => {
  describe(`FileTranslate#inflate`, () => {
    it('do', () => {
      const t = new FileTranslate(
        'CAN YOU HEAR ME.txt',
        TestResource.fileContent.orifinal,
        TestResource.fileContent.translate,
      );
      expect(t.inflate()).toStrictEqual({
        fileName: 'CAN YOU HEAR ME.txt',
        content: TestResource.fileContent.translate,
      });
    });
  });
});
