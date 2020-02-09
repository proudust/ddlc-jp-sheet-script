import { trimMargin, trimIndent } from './tags';

describe('trimMargin', () => {
  test('use tag', () => {
    const before = trimMargin`ABC
            |123
                |456`;
    expect(before).toBe('ABC\n123\n456');
  });

  test('use function', () => {
    const before = trimMargin(
      `
#XYZ
    #foo
    #bar
`,
      '#',
    );
    expect(before).toBe('XYZ\nfoo\nbar');
  });
});

describe('trimIndent', () => {
  test('use tag', () => {
    const before = trimIndent`
        ABC
         123
          456
        `;
    expect(before).toBe('ABC\n 123\n  456');
  });

  test('use function', () => {
    const before = trimIndent(`
        ABC
         123
          456
    `);
    expect(before).toBe('ABC\n 123\n  456');
  });
});
