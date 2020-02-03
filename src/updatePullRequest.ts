import { ScriptProperties } from './appscript/scriptProperties';

/**
 * GitHub のリポジトリに対し dispatches イベントを発火させます。
 */
export function updatePullRequest(): void {
  const { githubRepository, githubToken } = new ScriptProperties();
  const url = `https://api.github.com/repos/${githubRepository}/dispatches`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `token ${githubToken}`,
    },
    payload: JSON.stringify({
      // eslint-disable-next-line @typescript-eslint/camelcase
      event_type: 'update_translate',
    }),
  });
}
