const filesElement = document.getElementById('files') as HTMLInputElement;
const submitButton = document.getElementById('submit') as HTMLInputElement;
const messageDiv = document.getElementById('message') as HTMLElement;
if (!filesElement || !submitButton || !messageDiv) throw Error('#submit is not found.');

function submit(files: ArrayLike<File>): void {
  submitButton.disabled = true;
  messageDiv.textContent = 'シートを作成中……';
  const process = Array.from(files).map(
    file =>
      new Promise<undefined | Error>((resolve, reject) => {
        const reader = new FileReader();
        const [fileName = ''] = file.name.match(/^.+?(?=.rpy)/) || [];
        if (!fileName) reject();
        reader.onload = () =>
          google.script.run
            .withSuccessHandler(() => resolve())
            .withFailureHandler(e => resolve(e))
            .genelateSheet(fileName, reader.result);
        reader.onerror = () => resolve(new Error('FileReader error.'));
        reader.readAsText(file);
      }),
  );

  Promise.all(process).then(error => {
    if (error.every(v => !v)) {
      google.script.host.close();
      return;
    }

    submitButton.disabled = false;
    messageDiv.textContent =
      'エラーが発生しました。\n' +
      error
        .filter(<T>(x: T | undefined): x is T => !x)
        .map(e => e.message)
        .join('\n');
  });
}

submitButton.addEventListener('click', () => submit(filesElement.files || []));
