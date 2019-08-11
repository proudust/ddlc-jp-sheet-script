import * as fs from 'fs';
import { promisify } from 'util';
import FromTranslateScript from './converter/fromTranslateScript';
import ToCsv from './converter/toCsv';

// eslint-disable-next-line no-undef
const target = process.argv[2];

// eslint-disable-next-line no-undef
fs.readdirSync(target)
  .filter(fileName => /.rpy$/.test(fileName))
  .map(async fileName => {
    const content = await promisify(fs.readFile)(target + fileName, { encoding: 'utf-8' });
    return {
      fileName: fileName,
      content: FromTranslateScript.convert(content),
    };
  })
  .forEach(async p => {
    const file = await p;
    const csv = ToCsv.convert(file.content);
    promisify(fs.writeFile)(`dist/csv/${file.fileName}.csv`, csv);
  });
