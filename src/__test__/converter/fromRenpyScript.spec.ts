import FromRenpyScript from '../../converter/fromRenpyScript';

describe(`class FromRenpyScript`, () => {
  describe(`FromRenpyScript#convert`, () => {
    it('do', () => {
      const script = `
label introduction:
    m 1hub "God, I love you so much!"

    m "Do you love me, [player]?{nw}"
    menu:
        m "Do you love me, [player]?{fast}"
        "I love you too.":
            label yes:
                m 1hua "I'm so happy you feel the same way!"
                return
        "No.":
            m 1esd "No...?"
            jump chara_monika_scare

    m 1eub "Nothing's ever going to get in the way of our love again."
`;
      expect(FromRenpyScript.convert(script)).toMatchObject([
        {
          id: 'introduction_4dad65eb',
          attribute: 'm 1hub',
          original: 'God, I love you so much!',
          translate: '',
        },
        {
          id: 'introduction_9d928912',
          attribute: 'm',
          original: 'Do you love me, [player]?{nw}',
          translate: '',
        },
        {
          id: 'introduction_0c89200d',
          attribute: 'm nointeract',
          original: 'Do you love me, [player]?{fast}',
          translate: '',
        },
        { id: '', attribute: 'strings', original: 'I love you too.', translate: '' },
        {
          id: 'yes_47050ff0',
          attribute: 'm 1hua',
          original: "I'm so happy you feel the same way!",
          translate: '',
        },
        { id: '', attribute: 'strings', original: 'No.', translate: '' },
        {
          id: 'yes_25226899',
          attribute: 'm 1esd',
          original: 'No...?',
          translate: '',
        },
        {
          id: 'yes_5d3dfe0e',
          attribute: 'm 1eub',
          original: "Nothing's ever going to get in the way of our love again.",
          translate: '',
        },
      ]);
    });
  });
});
