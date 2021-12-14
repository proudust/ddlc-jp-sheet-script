import { assertEquals } from "../../deps.ts";
import { trimIndent, trimMargin } from "./tags.ts";

Deno.test("[trimMargin] use tag", () => {
  const before = trimMargin`ABC
            |123
                |456`;
  assertEquals(before, "ABC\n123\n456");
});

Deno.test("[trimMargin] use function", () => {
  const before = trimMargin(
    `
#XYZ
    #foo
    #bar
`,
    "#",
  );
  assertEquals(before, "XYZ\nfoo\nbar");
});

Deno.test("[trimIndent] use tag", () => {
  const before = trimIndent`
        ABC
         123
          456
        `;
  assertEquals(before, "ABC\n 123\n  456");
});

Deno.test("[trimIndent] use function", () => {
  const before = trimIndent(`
        ABC
         123
          456
    `);
  assertEquals(before, "ABC\n 123\n  456");
});
