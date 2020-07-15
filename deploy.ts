import { exec } from 'child_process';
import { writeFile } from 'fs';
import { promisify } from 'util';

interface Dist {
  name: string;
  scriptId: string;
}

const dists: Dist[] = [
  {
    name: 'Doki Doki Literature Club! 日本語化 作業所',
    scriptId: '1zp64PCtW2FYmfDMXn4nFT5g9tA5CWPAaP-qRBg-i0OUb5mjpX1_iOHYr',
  },
  {
    name: 'DDLC Monika After Story 日本語化 作業所',
    scriptId: '1rKilgJgbw-I_EEMvhYPm17X4BkED0xQkuLo_lVWdM90iXyTOhNi9-rh6',
  },
  {
    name: "Dweller's Empty Path 日本語化 作業所",
    scriptId: '1jv0pY3SZDm8_gCV_4DwI80NQTDWwJMY5Bci0ZGkNa7L2gXN_IG7XGp5P',
  },
];

const claspOptions = {
  rootDir: 'dist',
};

async function push(): Promise<void> {
  for (const { name, scriptId } of dists) {
    console.log(`push to "${name}"`);
    await promisify(writeFile)('.clasp.json', JSON.stringify({ ...claspOptions, scriptId }));
    await promisify(exec)('clasp push -f');
  }
}

push();
