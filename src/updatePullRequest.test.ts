import { updatePullRequest } from './updatePullRequest';

// eslint-disable-next-line @typescript-eslint/camelcase
declare let global: { UrlFetchApp: Partial<GoogleAppsScript.URL_Fetch.UrlFetchApp> };

beforeAll(() => (global.UrlFetchApp = {}));

const props = {
  githubRepository: 'proudust/ddlc-jp-patch',
  githubToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

test('calls UrlFetchApp.fetch only once', () => {
  const fetch = jest.fn();
  global.UrlFetchApp.fetch = fetch;

  updatePullRequest(props);
  expect(fetch.mock.calls.length).toBe(1);
});

test('If UrlFetchApp.fetch returns an exception, dont catch that exception.', () => {
  global.UrlFetchApp.fetch = jest.fn(() => {
    throw new Error();
  });

  expect(() => updatePullRequest(props)).toThrowError();
});
