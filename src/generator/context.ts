/** 翻訳ファイルの出力先を表すコンテキスト */
export interface Context<TReturn> {
  /** 出力するファイルを追加する */
  addFile(fileName: string, content: string): void;
  /** 出力を開始する */
  finish(): TReturn;
}

/** 保存しない場合のコンテキスト */
export class DryRunContext implements Context<void> {
  addFile(): void {
    // do nothing
  }

  finish(): void {
    // do nothing
  }
}

/** GoogleDrive に保存する場合のコンテキスト */
export class DriveContext implements Context<void> {
  /** 出力するフォルダ名 */
  private folderName: string;
  /** 保存するファイルの Blob */
  private readonly blobs: GoogleAppsScript.Base.BlobSource[] = [];

  /** @param folderName 出力するフォルダ名 */
  constructor(folderPrefix: string, createDate: Date) {
    const zeroPadding = (number: number): string => ("0" + number).slice(-2);
    const year = createDate.getFullYear();
    const month = zeroPadding(createDate.getMonth() + 1);
    const day = zeroPadding(createDate.getDate());
    const hour = zeroPadding(createDate.getHours());
    const min = zeroPadding(createDate.getMinutes());
    const sec = zeroPadding(createDate.getSeconds());
    this.folderName = `${folderPrefix}_${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }

  /** 出力するファイルを追加する */
  addFile(fileName: string, content: string): void {
    const lfContent = content.replace(/\n|\r\n|\r/g, "\n");
    const blob = Utilities.newBlob("", "text/plan", fileName);
    blob.setDataFromString(lfContent, "utf-8");
    this.blobs.push(blob);
  }

  /** 出力を開始する */
  finish(): void {
    const folder = DriveApp.getRootFolder().createFolder(this.folderName);
    this.blobs.forEach((blob) => folder.createFile(blob));
    const msg = `あなたのGoogle Driveのマイドライブ/${this.folderName}に保存されました。`;
    Browser.msgBox(msg);
  }
}

/** Zip 圧縮して Base64 文字列を HTTP で表示する場合のコンテキスト */
export class HttpContext implements Context<GoogleAppsScript.Content.TextOutput> {
  /** 保存するファイルの Blob */
  private readonly blobs: GoogleAppsScript.Base.BlobSource[] = [];

  /** 出力するファイルを追加する */
  addFile(fileName: string, content: string): void {
    const lfContent = content.replace(/\n|\r\n|\r/g, "\n");
    const blob = Utilities.newBlob("", "text/plan", fileName);
    blob.setDataFromString(lfContent, "utf-8");
    this.blobs.push(blob);
  }

  /** 出力を開始する */
  finish(): GoogleAppsScript.Content.TextOutput {
    const blobZip = Utilities.zip(this.blobs);
    const encodedZip = Utilities.base64Encode(blobZip.getBytes());
    return ContentService.createTextOutput()
      .setContent(encodedZip)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
