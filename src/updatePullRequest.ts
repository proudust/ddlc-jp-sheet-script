interface GitHubConfig {
  githubRepository: string;
  githubToken: string;
}

/**
 * GitHub のリポジトリに対し dispatches イベント (type: update_translate) を発火させます。
 * それをトリガーに GitHub Actions 側で翻訳スクリプトを生成します。
 */
export function updatePullRequest({ githubRepository, githubToken }: GitHubConfig): void {
  const url = `https://api.github.com/repos/${githubRepository}/dispatches`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `token ${githubToken}`,
    },
    payload: JSON.stringify({
      event_type: 'update_translate',
    }),
  });
}
