const filesElement = document.getElementById('files') as HTMLInputElement | null;
const submitButton = document.getElementById('submit');
if (!filesElement || !submitButton) throw Error('#submit is not found.');

function submit(files: ArrayLike<File>): void {
  const process = Array.from(files).map(
    file =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        const [fileName = ''] = file.name.match(/^.+?(?=.rpy)/) || [];
        if (!fileName) reject();
        reader.onload = () =>
          google.script.run
            .withSuccessHandler(() => resolve())
            .withFailureHandler(() => reject())
            .genelateSheet(fileName, reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      }),
  );

  Promise.all(process)
    .then(() => google.script.host.close())
    .catch(() => google.script.host.close());
}

submitButton.addEventListener('click', () => submit(filesElement.files || []));
