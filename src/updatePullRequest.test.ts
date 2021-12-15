import { assertSpyCalls, assertThrows, stub } from "../deps.ts";
import { updatePullRequest } from "./updatePullRequest.ts";

declare let globalThis: {
  UrlFetchApp: {
    fetch(): void;
  };
};

globalThis.UrlFetchApp = {
  fetch: () => {},
};

const props = {
  githubRepository: "proudust/ddlc-jp-patch",
  githubToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

Deno.test("calls UrlFetchApp.fetch only once", () => {
  const fetch = stub(UrlFetchApp, "fetch");
  try {
    updatePullRequest(props);
    assertSpyCalls(fetch, 1);
  } finally {
    fetch.restore();
  }
});

Deno.test("If UrlFetchApp.fetch returns an exception, dont catch that exception.", () => {
  globalThis.UrlFetchApp.fetch = () => {
    throw new Error();
  };
  assertThrows(() => updatePullRequest(props));
});
