import { ScriptProperties } from './scriptProperties';

test('ScriptProperties#folderName', () => {
  const { folderName } = new ScriptProperties({ FOLDER_NAME: 'DDLC_JP' });
  expect(folderName).toBe('DDLC_JP');

  expect(() => new ScriptProperties({}).folderName).toThrowError(
    /^\w+ is not defined in the script property.$/,
  );
});

test('ScriptProperties#tags', () => {
  const { tags } = new ScriptProperties({
    TAG_NAMES: '解決済,要変更,バグ,提案,重複,削除',
    TAG_COLORS: ',#FFF2CC,#FCE5CD,#D9EAD3,#EFEFEF,#CCCCCC',
  });
  expect(tags).toStrictEqual([
    { name: '解決済', color: '' },
    { name: '要変更', color: '#FFF2CC' },
    { name: 'バグ', color: '#FCE5CD' },
    { name: '提案', color: '#D9EAD3' },
    { name: '重複', color: '#EFEFEF' },
    { name: '削除', color: '#CCCCCC' },
  ]);

  expect(() => new ScriptProperties({}).tags).toThrowError(
    /^\w+ is not defined in the script property.$/,
  );
});

test(`ScriptProperties#notConvertColor`, () => {
  const { notConvertColor } = new ScriptProperties({ NOT_CONVERT_COLORS: '#FFFFFF' });
  expect(notConvertColor).toEqual('#ffffff');

  expect(new ScriptProperties({}).notConvertColor).toBeUndefined();
});

test(`ScriptProperties#notConvertColor`, () => {
  const props1 = new ScriptProperties({ INCLUDE_HISTORY_SUPPORT: 'True' });
  expect(props1.includeHistorySupport).toBe(true);

  const props2 = new ScriptProperties({ INCLUDE_HISTORY_SUPPORT: 'False' });
  expect(props2.includeHistorySupport).toBe(false);

  const props3 = new ScriptProperties({ INCLUDE_HISTORY_SUPPORT: 'test' });
  expect(props3.includeHistorySupport).toBe(true);

  expect(new ScriptProperties({}).includeHistorySupport).toBe(false);
});

test('ScriptProperties#githubRepository', () => {
  const { githubRepository } = new ScriptProperties({
    GITHUB_REPOSITORY: 'proudust/ddlc-jp-patch',
  });
  expect(githubRepository).toBe('proudust/ddlc-jp-patch');

  expect(() => new ScriptProperties({}).githubRepository).toThrowError(
    /^\w+ is not defined in the script property.$/,
  );
});

test('ScriptProperties#githubToken', () => {
  const { githubToken } = new ScriptProperties({
    GITHUB_TOKEN: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  });
  expect(githubToken).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  expect(() => new ScriptProperties({}).githubToken).toThrowError(
    /^\w+ is not defined in the script property.$/,
  );
});
