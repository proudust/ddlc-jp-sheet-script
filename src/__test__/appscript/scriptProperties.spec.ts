import { ScriptProperties } from '../../appscript/scriptProperties';

import { setupPropertiesService } from '../mock/setupPropertiesService';

const dummy = (dummy: Partial<ScriptProperties['raw']>): ScriptProperties['raw'] =>
  Object.assign(
    {
      FOLDER_NAME: '',
      TAG_NAMES: '',
      TAG_COLORS: '',
    },
    dummy,
  );

describe(`class ScriptProperties`, () => {
  describe(`new ScriptProperties`, () => {
    it('success', () => {
      setupPropertiesService(dummy({}));
      new ScriptProperties();
    });

    it('script properties is not defined', () => {
      setupPropertiesService({});
      expect(() => new ScriptProperties()).toThrowError(
        /^\w+ is not defined in the script property.$/,
      );
    });
  });

  describe(`ScriptProperties#folderName`, () => {
    it('success', () => {
      setupPropertiesService(dummy({ FOLDER_NAME: 'DDLC_JP' }));
      expect(new ScriptProperties().folderName).toEqual('DDLC_JP');
    });
  });

  describe(`ScriptProperties#tags`, () => {
    it('success', () => {
      setupPropertiesService(
        dummy({
          TAG_NAMES: '解決済,要変更,バグ,提案,重複,削除',
          TAG_COLORS: ',#FFF2CC,#FCE5CD,#D9EAD3,#EFEFEF,#CCCCCC',
        }),
      );
      expect(new ScriptProperties().tags).toMatchObject([
        {
          name: '解決済',
          color: '',
        },
        {
          name: '要変更',
          color: '#FFF2CC',
        },
        {
          name: 'バグ',
          color: '#FCE5CD',
        },
        {
          name: '提案',
          color: '#D9EAD3',
        },
        {
          name: '重複',
          color: '#EFEFEF',
        },
        {
          name: '削除',
          color: '#CCCCCC',
        },
      ]);
    });
  });
});