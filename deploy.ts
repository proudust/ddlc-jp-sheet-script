import { $ } from "https://deno.land/x/zx_deno/mod.mjs";

interface Dist {
  readonly name: string;
  readonly scriptId: string;
}

const dists: readonly Dist[] = [
  {
    name: "Doki Doki Literature Club! 日本語化 作業所",
    scriptId: "1zp64PCtW2FYmfDMXn4nFT5g9tA5CWPAaP-qRBg-i0OUb5mjpX1_iOHYr",
  },
  {
    name: "DDLC Monika After Story 日本語化 作業所",
    scriptId: "1rKilgJgbw-I_EEMvhYPm17X4BkED0xQkuLo_lVWdM90iXyTOhNi9-rh6",
  },
  {
    name: "DDLC 3rd-anniversary Twitch Writes 日本語化 作業所",
    scriptId: "19u-8kNq3jPbQgr6_QeLqhGH7jJLLT76YjtykLWxXl8ahX1p3GbjDkKhD",
  },
  {
    name: "Dweller's Empty Path 日本語化 作業所",
    scriptId: "1jv0pY3SZDm8_gCV_4DwI80NQTDWwJMY5Bci0ZGkNa7L2gXN_IG7XGp5P",
  },
  {
    name: "Escaped Chasm 日本語化 作業所",
    scriptId: "1JJPXEJ8hzzfHXnkPTfXbL3iAiPoaJB2ZTa6Iq4DkYHnNpAXfM0pe35jq",
  },
] as const;

const claspOptions = {
  rootDir: "dist",
} as const;

for (const { name, scriptId } of dists) {
  console.log(`push to "${name}"`);
  await Deno.writeTextFile(
    ".clasp.json",
    JSON.stringify({ ...claspOptions, scriptId }),
  );
  await $`clasp push -f`;
}
