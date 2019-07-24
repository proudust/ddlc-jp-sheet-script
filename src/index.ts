import { SheetService } from './sheet.service';

declare var global: { [key: string]: Function };

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};
