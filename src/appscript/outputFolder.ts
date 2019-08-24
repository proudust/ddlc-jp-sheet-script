export class OutputFolder {
  public name: string;
  public files: {
    fileName: string;
    content: string;
  }[];

  /**
   * create output folder.
   *
   * @param name folder name prefix
   * @param createDate date of folder name
   */
  public constructor(name: string, createDate: Date) {
    const zeroPadding = (number: number): string => ('0' + number).slice(-2);
    const year = createDate.getFullYear();
    const month = zeroPadding(createDate.getMonth() + 1);
    const day = zeroPadding(createDate.getDate());
    const hour = zeroPadding(createDate.getHours());
    const min = zeroPadding(createDate.getMinutes());
    const sec = zeroPadding(createDate.getSeconds());
    this.name = `${name}_${year}-${month}-${day} ${hour}:${min}:${sec}`;
    this.files = [];
  }

  /**
   * save to Google Drive.
   */
  public save(): void {
    const folder = DriveApp.getRootFolder().createFolder(this.name);
    for (let i = 0; i < this.files.length; i++) {
      const { fileName, content } = this.files[i];
      const blob = Utilities.newBlob('', 'text/plain', fileName).setDataFromString(
        content.replace(/\n|\r\n|\r/g, '\n'),
        'utf-8',
      );
      folder.createFile(blob);
    }
  }
}
