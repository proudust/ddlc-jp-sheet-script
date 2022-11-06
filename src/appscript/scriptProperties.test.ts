import { assertEquals, assertThrows } from "../../dev-deps.ts";
import { ScriptProperties } from "./scriptProperties.ts";

Deno.test("ScriptProperties#folderName", () => {
  const { folderName } = new ScriptProperties({ FOLDER_NAME: "DDLC_JP" });
  assertEquals(folderName, "DDLC_JP");

  assertThrows(
    () => new ScriptProperties({}).folderName,
    " is not defined in the script property.",
  );
});

Deno.test("ScriptProperties#tags", () => {
  const { tags } = new ScriptProperties({
    TAG_NAMES: "解決済,要変更,バグ,提案,重複,削除",
    TAG_COLORS: ",#FFF2CC,#FCE5CD,#D9EAD3,#EFEFEF,#CCCCCC",
  });
  assertEquals(tags, [
    { name: "解決済", color: "" },
    { name: "要変更", color: "#FFF2CC" },
    { name: "バグ", color: "#FCE5CD" },
    { name: "提案", color: "#D9EAD3" },
    { name: "重複", color: "#EFEFEF" },
    { name: "削除", color: "#CCCCCC" },
  ]);

  assertThrows(
    () => new ScriptProperties({}).tags,
    " is not defined in the script property.",
  );
});

Deno.test(`ScriptProperties#notConvertColor`, () => {
  const { notConvertColor } = new ScriptProperties({
    NOT_CONVERT_COLORS: "#FFFFFF",
  });
  assertEquals(notConvertColor, "#ffffff");

  assertEquals(new ScriptProperties({}).notConvertColor, undefined);
});

Deno.test(`ScriptProperties#exportMode`, () => {
  const props1 = new ScriptProperties({ EXPORT_MODE: "Ren'Py" });
  assertEquals(props1.exportMode, "Ren'Py");

  const props2 = new ScriptProperties({
    EXPORT_MODE: "Ren'Py with history support",
  });
  assertEquals(props2.exportMode, "Ren'Py with history support");

  const props3 = new ScriptProperties({ EXPORT_MODE: "JSON" });
  assertEquals(props3.exportMode, "JSON");

  assertThrows(
    () => new ScriptProperties({ EXPORT_MODE: "test" }).exportMode,
    " is invalid export mode.",
  );

  assertThrows(
    () => new ScriptProperties({}).exportMode,
    " is not defined in the script property.",
  );
});

Deno.test("ScriptProperties#githubRepository", () => {
  const { githubRepository } = new ScriptProperties({
    GITHUB_REPOSITORY: "proudust/ddlc-jp-patch",
  });
  assertEquals(githubRepository, "proudust/ddlc-jp-patch");

  assertThrows(
    () => new ScriptProperties({}).githubRepository,
    " is not defined in the script property.",
  );
});

Deno.test("ScriptProperties#githubToken", () => {
  const { githubToken } = new ScriptProperties({
    GITHUB_TOKEN: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  });
  assertEquals(githubToken, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  assertThrows(
    () => new ScriptProperties({}).githubToken,
    " is not defined in the script property.",
  );
});
